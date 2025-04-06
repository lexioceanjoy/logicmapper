#!/usr/bin/env python3
from typing import Dict, List, Union
from jsonschema import validate, ValidationError
import re

# JSON Schema for the logic tree
LOGIC_TREE_SCHEMA = {
    "type": "object",
    "properties": {
        "condition": {"type": "string"},
        "action": {"type": "string"},
        "then": {
            "oneOf": [
                {
                    "type": "array",
                    "items": {"$ref": "#"}
                },
                {"$ref": "#"}
            ]
        },
        "else": {"$ref": "#"}
    },
    "additionalProperties": False
}

class LogicTreeValidator:
    def __init__(self):
        self.errors: List[str] = []
        
    def _validate_schema(self, json_data: Dict) -> bool:
        """Validate JSON against the schema."""
        try:
            validate(instance=json_data, schema=LOGIC_TREE_SCHEMA)
            return True
        except ValidationError as e:
            self.errors.append(f"Schema validation error: {str(e)}")
            return False
    
    def _validate_condition_format(self, node: Dict, path: str = "root") -> bool:
        """Validate condition format and content."""
        is_valid = True
        
        if "condition" in node:
            condition = node["condition"]
            # Check if condition starts with expected keywords
            if not any(condition.lower().startswith(kw) for kw in ["if", "check", "when"]):
                self.errors.append(f"Invalid condition format at {path}: Should start with 'If', 'Check', or 'When'")
                is_valid = False
            
            # Check for empty conditions
            if len(condition.strip()) < 3:
                self.errors.append(f"Empty or too short condition at {path}")
                is_valid = False
        
        return is_valid
    
    def _validate_action_format(self, node: Dict, path: str = "root") -> bool:
        """Validate action format and content."""
        is_valid = True
        
        if "action" in node:
            action = node["action"]
            # Check for empty actions
            if len(action.strip()) < 2:
                self.errors.append(f"Empty or too short action at {path}")
                is_valid = False
            
            # Check if action contains any condition keywords
            if any(kw in action.lower() for kw in ["if ", "check ", "when "]):
                self.errors.append(f"Action contains condition keywords at {path}")
                is_valid = False
        
        return is_valid
    
    def _validate_logical_structure(self, node: Dict, path: str = "root") -> bool:
        """Validate logical structure of the tree."""
        is_valid = True
        
        # Check for mutually exclusive fields
        if "action" in node and "then" in node:
            self.errors.append(f"Node cannot have both 'action' and 'then' at {path}")
            is_valid = False
        
        # Check for required fields
        if "condition" in node and not ("action" in node or "then" in node):
            self.errors.append(f"Condition without action or further conditions at {path}")
            is_valid = False
        
        # Validate nested structures
        if "then" in node:
            if isinstance(node["then"], list):
                for i, child in enumerate(node["then"]):
                    child_path = f"{path}.then[{i}]"
                    is_valid &= self._validate_node(child, child_path)
            else:
                is_valid &= self._validate_node(node["then"], f"{path}.then")
        
        if "else" in node:
            is_valid &= self._validate_node(node["else"], f"{path}.else")
        
        return is_valid
    
    def _validate_node(self, node: Dict, path: str = "root") -> bool:
        """Validate a single node in the tree."""
        is_valid = True
        
        is_valid &= self._validate_condition_format(node, path)
        is_valid &= self._validate_action_format(node, path)
        is_valid &= self._validate_logical_structure(node, path)
        
        return is_valid
    
    def validate(self, json_data: Dict) -> bool:
        """
        Validate the entire JSON logic tree.
        Returns True if valid, False otherwise.
        """
        self.errors = []  # Reset errors
        
        # Validate against JSON schema
        if not self._validate_schema(json_data):
            return False
        
        # Validate tree structure and content
        return self._validate_node(json_data)
    
    def get_errors(self) -> List[str]:
        """Get list of validation errors."""
        return self.errors 