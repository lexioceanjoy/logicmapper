# HTML Table to JSON Logic Tree Project

This project consists of two main components:
1. A Python-based converter that transforms HTML tables into JSON logic trees
2. A React-based viewer for visualizing the JSON logic trees

## Project Structure

```
.
├── json-tree-viewer/       # React application for viewing JSON trees
├── html_to_json_converter.py  # Python script for HTML to JSON conversion
├── json_validator.py       # JSON validation script
└── requirements.txt       # Python dependencies
```

## Quick Start

### Setting up the JSON Tree Viewer (React App)

1. Navigate to the json-tree-viewer directory:
```bash
cd json-tree-viewer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The viewer will be available at http://localhost:3000 (or another port if 3000 is in use).

### Using the HTML to JSON Converter

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the converter:
```bash
python3 html_to_json_converter.py input.html output.json
```

## Available JSON Files

The project includes a sample JSON file in `json-tree-viewer/public/`:
- `claims_logic.json` - Sample claims adjudication logic

## Troubleshooting

If you encounter issues with the React app:
1. Make sure you're in the correct directory (`json-tree-viewer`)
2. Try removing and reinstalling dependencies:
```bash
cd json-tree-viewer
rm -rf node_modules package-lock.json
npm install
```

For Python script issues:
1. Verify Python 3.x is installed
2. Ensure all dependencies are installed:
```bash
pip install -r requirements.txt
```

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

## Dependencies

### Converter (Python)
- beautifulsoup4: HTML parsing
- lxml: Efficient HTML parser
- jsonschema: JSON validation
- argparse: Command line argument parsing

### Viewer (Node.js)
- React 18.2.0 with hooks
- react-dom 18.2.0
- react-scripts 5.0.1
- Testing libraries for development
- Create React App for tooling 