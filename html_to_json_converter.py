#!/usr/bin/env python3
import json
import logging
from bs4 import BeautifulSoup
import argparse
from typing import Dict, List, Union, Optional, Any
import sys
from json_validator import LogicTreeValidator
from dataclasses import dataclass
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@dataclass
class ConverterConfig:
    """Configuration for the HTML to JSON converter."""
    condition_indicators: List[str] = None
    skip_headers: bool = True
    strict_validation: bool = False
    indent_level: int = 2
    encoding: str = 'utf-8'
    parser: str = 'lxml'
    
    def __post_init__(self):
        if self.condition_indicators is None:
            self.condition_indicators = ['if', 'check', 'when']

class ConversionError(Exception):
    """Base exception for conversion errors."""
    pass

class HTMLParsingError(ConversionError):
    """Raised when HTML parsing fails."""
    pass

class ValidationError(ConversionError):
    """Raised when JSON validation fails."""
    pass

class HTMLLogicTreeConverter:
    def __init__(self, config: Optional[ConverterConfig] = None):
        """Initialize converter with optional configuration."""
        self.config = config or ConverterConfig()
        self.validator = LogicTreeValidator()
        self._setup_logging()
    
    def _setup_logging(self) -> None:
        """Configure logging for the converter."""
        self.logger = logging.getLogger(__name__)
        if self.config.strict_validation:
            self.logger.setLevel(logging.DEBUG)
    
    def _is_condition(self, text: str) -> bool:
        """Check if the text represents a condition."""
        return any(indicator.lower() in text.lower() 
                  for indicator in self.config.condition_indicators)
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize text content."""
        if not isinstance(text, str):
            return ""
        return " ".join(text.strip().split())
    
    def _safe_find_all(self, element: Any, *args, **kwargs) -> List:
        """Safely perform BeautifulSoup find_all operation."""
        try:
            return element.find_all(*args, **kwargs) if element else []
        except Exception as e:
            self.logger.warning(f"Error in find_all operation: {str(e)}")
            return []
    
    def _parse_table(self, table, depth: int = 0) -> List[Dict]:
        """Parse a table recursively."""
        result = []
        
        try:
            # Find tbody if it exists, otherwise use table directly
            tbody = table.find('tbody') or table
            rows = self._safe_find_all(tbody, 'tr', recursive=False)
            
            # Skip header row if configured
            if depth == 0 and self.config.skip_headers and table.find('th'):
                rows = rows[1:]
            
            self.logger.debug(f"{'  ' * depth}Processing table with {len(rows)} rows")
            
            for row in rows:
                cells = self._safe_find_all(row, 'td', recursive=False)
                if len(cells) == 2:
                    condition = self._clean_text(cells[0].get_text())
                    self.logger.debug(f"{'  ' * depth}Found condition: {condition}")
                    
                    # Check for nested table in the second cell
                    nested_table = cells[1].find('table', recursive=False)
                    if nested_table:
                        nested_results = self._parse_table(nested_table, depth + 1)
                        if nested_results:
                            node = {
                                "condition": condition,
                                "then": nested_results
                            }
                            result.append(node)
                    else:
                        action = self._clean_text(cells[1].get_text())
                        self.logger.debug(f"{'  ' * depth}Found action: {action}")
                        if action and not self._is_condition(action):
                            node = {
                                "condition": condition,
                                "action": action
                            }
                            result.append(node)
        
        except Exception as e:
            self.logger.error(f"Error parsing table at depth {depth}: {str(e)}")
            if self.config.strict_validation:
                raise HTMLParsingError(f"Failed to parse table: {str(e)}")
        
        return result
    
    def _process_claim_type(self, node: Dict) -> Dict:
        """Process a claim type node and its nested conditions."""
        if "then" in node:
            nested_nodes = []
            current_group = None
            
            try:
                for child in node["then"]:
                    if "condition" in child and "then" in child:
                        if current_group is None:
                            current_group = child
                        else:
                            nested_nodes.append(current_group)
                            current_group = child
                    elif current_group is not None:
                        if "then" not in current_group:
                            current_group["then"] = []
                        current_group["then"].append(child)
                
                if current_group is not None:
                    nested_nodes.append(current_group)
                
                node["then"] = nested_nodes
            
            except Exception as e:
                self.logger.error(f"Error processing claim type: {str(e)}")
                if self.config.strict_validation:
                    raise ConversionError(f"Failed to process claim type: {str(e)}")
        
        return node
    
    def convert(self, html_content: str, root_condition: Optional[str] = None) -> Dict:
        """Convert HTML content to JSON logic tree."""
        try:
            soup = BeautifulSoup(html_content, self.config.parser)
            main_table = soup.find('table')
            if not main_table:
                raise HTMLParsingError("No table found in HTML content")
            
            self.logger.info("Starting conversion...")
            result = self._parse_table(main_table)
            self.logger.info(f"Found {len(result)} top-level nodes")
            
            # Process each claim type
            final_result = []
            for node in result:
                if "condition" in node and node["condition"].startswith("If Claim Type"):
                    processed_node = self._process_claim_type(node)
                    final_result.append(processed_node)
            
            # Wrap in root condition if provided
            if root_condition:
                final_result = {
                    "condition": root_condition,
                    "then": final_result
                }
            
            # Validate the generated JSON
            if not self.validator.validate(final_result):
                errors = self.validator.get_errors()
                for error in errors:
                    self.logger.warning(f"Validation error: {error}")
                if self.config.strict_validation:
                    raise ValidationError("JSON validation failed")
            
            return final_result
        
        except Exception as e:
            self.logger.error(f"Conversion failed: {str(e)}")
            raise

def main():
    parser = argparse.ArgumentParser(description='Convert HTML tables to JSON logic trees')
    parser.add_argument('input_file', help='Input HTML file path')
    parser.add_argument('output_file', help='Output JSON file path')
    parser.add_argument('--root-condition', help='Optional root condition name')
    parser.add_argument('--strict', action='store_true', help='Exit with error if validation fails')
    parser.add_argument('--no-headers', action='store_true', help='Do not skip table headers')
    parser.add_argument('--log-level', choices=['DEBUG', 'INFO', 'WARNING', 'ERROR'],
                      default='INFO', help='Set the logging level')
    args = parser.parse_args()
    
    # Configure logging level
    logging.getLogger().setLevel(getattr(logging, args.log_level))
    
    try:
        # Create configuration
        config = ConverterConfig(
            strict_validation=args.strict,
            skip_headers=not args.no_headers
        )
        
        # Read HTML file
        input_path = Path(args.input_file)
        if not input_path.exists():
            raise FileNotFoundError(f"Input file not found: {args.input_file}")
        
        with open(input_path, 'r', encoding=config.encoding) as f:
            html_content = f.read()
        
        # Convert to JSON
        converter = HTMLLogicTreeConverter(config)
        result = converter.convert(html_content, args.root_condition)
        
        # Write JSON output
        output_path = Path(args.output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding=config.encoding) as f:
            json.dump(result, f, indent=config.indent_level, ensure_ascii=False)
        
        logger.info(f"Successfully converted {args.input_file} to {args.output_file}")
        
    except Exception as e:
        logger.error(str(e))
        sys.exit(1)

if __name__ == "__main__":
    main() 