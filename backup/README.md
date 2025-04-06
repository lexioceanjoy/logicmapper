# HTML Table to JSON Logic Tree Converter

This tool converts nested HTML tables representing business logic into validated JSON logic trees. It's particularly useful for converting complex decision tables, such as claims adjudication rules, into a machine-readable format.

## Features

- Converts nested HTML tables to JSON logic trees
- Handles complex nested conditions and actions
- Validates JSON structure and content
- Supports strict validation mode
- Provides detailed error messages
- Uses efficient HTML parsing with lxml

## Installation

1. Clone this repository
2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

Basic usage:
```bash
python3 html_to_json_converter.py input.html output.json
```

With root condition and strict validation:
```bash
python3 html_to_json_converter.py input.html output.json --root-condition "Check Claim Type" --strict
```

## HTML Table Format

The input HTML table should follow this structure:
- Two columns: Condition (left) and Action/Nested Table (right)
- Conditions should start with "If", "Check", or "When"
- Actions should be in the right column
- Nested tables can be placed in the right column for sub-conditions

Example:
```html
<table>
  <tr>
    <th>Condition</th>
    <th>Action/Sub-conditions</th>
  </tr>
  <tr>
    <td>If Claim Type is Outpatient</td>
    <td>
      <table>
        <tr>
          <td>If Procedure Code is 1001</td>
          <td>Standard Rate</td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```

## JSON Output Format

The output JSON follows this structure:
```json
{
  "condition": "string",
  "then": [
    {
      "condition": "string",
      "action": "string"
    },
    {
      "condition": "string",
      "then": []
    }
  ]
}
```

## Validation

The tool validates:
- JSON schema compliance
- Condition format and content
- Action format and content
- Logical structure
- Mutually exclusive fields
- Required fields

## Error Handling

- Schema validation errors
- Condition format errors
- Action format errors
- Logical structure errors
- File I/O errors

## Dependencies

- beautifulsoup4: HTML parsing
- lxml: Efficient HTML parser
- jsonschema: JSON validation
- argparse: Command line argument parsing 