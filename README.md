# HTML Table to JSON Logic Tree Converter and Viewer

This project consists of two main components:
1. A converter tool that transforms nested HTML tables into JSON logic trees
2. An interactive viewer for exploring and visualizing the generated JSON logic trees

## HTML to JSON Converter

The converter tool transforms complex nested HTML tables representing business logic into validated JSON logic trees. It's particularly useful for converting decision tables, such as claims adjudication rules, into a machine-readable format.

### Converter Features

- Converts nested HTML tables to JSON logic trees
- Handles complex nested conditions and actions
- Validates JSON structure and content
- Supports strict validation mode
- Provides detailed error messages
- Uses efficient HTML parsing with lxml

## JSON Tree Viewer

The viewer component is a modern React application that provides an interactive interface for exploring the JSON logic trees. It features color-coded nesting levels, expandable nodes, and intuitive visualization of conditions and actions.

### Viewer Features

- Intelligent display of conditions and actions:
  - Direct display of condition text without redundant labels
  - Actions shown in green with arrow indicators (→)
  - "Possible Paths" for multiple options
  - Smart handling of nested logic
- Color-coded nesting levels for better visual hierarchy
- Modern UI/UX with expandable nodes and smooth animations
- Automatic loading of JSON files
- Support for custom file uploads

## Installation

1. Clone this repository
2. Install Python dependencies for the converter:
```bash
pip install -r requirements.txt
```
3. Install Node.js dependencies for the viewer:
```bash
cd json-tree-viewer
npm install
```

## Usage

### Converting HTML to JSON

Basic usage:
```bash
python3 html_to_json_converter.py input.html output.json
```

With root condition and strict validation:
```bash
python3 html_to_json_converter.py input.html output.json --root-condition "Check Claim Type" --strict
```

### Viewing JSON Logic Trees

1. Start the viewer development server:
```bash
cd json-tree-viewer
npm start
```
2. Open [http://localhost:3001](http://localhost:3001) in your browser
3. The viewer will automatically load claims_logic.json if present
4. You can upload custom JSON files through the UI

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

## JSON Structure

The logic trees follow this structure:
```json
{
  "condition": "Check Claim Type",
  "then": [
    {
      "condition": "Claim Type is Outpatient",
      "action": "Apply Standard Rate"
    },
    {
      "condition": "Claim Type is Inpatient",
      "then": [
        {
          "condition": "Length of Stay > 3 days",
          "action": "Apply Extended Stay Rate"
        }
      ]
    }
  ]
}
```

## Validation

The converter validates:
- JSON schema compliance
- Condition format and content
- Action format and content
- Logical structure
- Mutually exclusive fields
- Required fields

## Dependencies

### Converter
- beautifulsoup4: HTML parsing
- lxml: Efficient HTML parser
- jsonschema: JSON validation
- argparse: Command line argument parsing

### Viewer
- React 18 with hooks
- Modern JavaScript
- CSS-in-JS styling
- Webpack bundling 