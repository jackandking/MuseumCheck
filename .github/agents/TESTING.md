# Custom Agent Test: Museum Data Quality Check

This file demonstrates how the museum-data-checker custom agent works.

## Test Scenario 1: Checking for Duplicates

The agent should automatically detect when we're working with museum data and perform systematic checks.

### Example Task
"Check if there are any duplicate museum names or IDs in the museums-data.js file"

### Expected Agent Behavior
The agent should:
1. Load the museum data from museums-data.js
2. Check for duplicate names across all entries
3. Check for duplicate IDs
4. Report findings with exact counts and indices
5. Provide recommendations for fixes

### Validation Command
```bash
node tools/validate-museum-data.js
```

## Test Scenario 2: Data Integrity Check

### Example Task
"Verify that all museums have the required fields: id, name, location, description"

### Expected Agent Behavior
The agent should:
1. Iterate through all museum entries
2. Validate presence of required fields
3. Check for undefined, null, or empty values
4. Report any museums with missing fields
5. Provide specific indices and museum names

## Test Scenario 3: Age Group Content Validation

### Example Task
"Ensure all museums have proper checklist structure for all three age groups (3-6, 7-12, 13-18)"

### Expected Agent Behavior
The agent should:
1. Check for presence of checklists object
2. Verify parent and child categories exist
3. Confirm all three age groups are defined
4. Report any structural inconsistencies

## Test Scenario 4: Systematic Issue Detection

### Example Task
"Before fixing a duplicate museum entry, run a comprehensive analysis"

### Expected Agent Behavior
The agent should:
1. STOP and run full validation first
2. Quantify ALL issues found (not just the one being fixed)
3. Report systematic patterns (e.g., 41 duplicate names)
4. Provide impact assessment
5. ASK user whether to fix systematically or individually

## Manual Testing

To test the custom agent manually:

1. **Via GitHub Copilot Chat:**
   ```
   @museum-data-checker check for duplicate museums in museums-data.js
   ```

2. **Via Validation Script:**
   ```bash
   cd /home/runner/work/MuseumCheck/MuseumCheck
   node tools/validate-museum-data.js
   ```

3. **Expected Output:**
   ```
   🔍 Museum Data Validation Tool
   =====================================
   
   ✅ Successfully loaded 262 museums from museums-data.js
   
   🏛️  Checking for duplicate museum names...
   ✅ No duplicate museum names found
   
   🆔 Checking for duplicate museum IDs...
   ✅ No duplicate museum IDs found
   
   📋 Checking required fields...
   ✅ All museums have required fields
   
   📝 Checking checklist structure...
   ✅ All museums have proper checklist structure
   
   📊 VALIDATION SUMMARY
   ===================
   Total museums: 262
   Duplicate names: 0
   Duplicate IDs: 0
   Field errors: 0
   Checklist errors: 0
   
   ✅ DATA VALIDATION PASSED
   ```

## Integration with Development Workflow

The custom agent integrates seamlessly with:

1. **Pre-commit validation**: Run before committing museum data changes
2. **Code review**: Automatically invoked during PR reviews involving museum data
3. **Issue triage**: Helps diagnose data quality issues reported by users
4. **Systematic fixes**: Ensures comprehensive fixes rather than individual patches

## Benefits

✅ **Prevents regression**: Catches data quality issues before they reach production
✅ **Systematic analysis**: Identifies patterns and root causes, not just symptoms  
✅ **Automation**: Reduces manual validation effort
✅ **Consistency**: Ensures uniform data quality standards
✅ **Education**: Teaches developers about data quality best practices

## See Also

- [Custom Agents README](.github/agents/README.md) - Detailed agent documentation
- [Validation Script](tools/validate-museum-data.js) - Standalone validation tool
- [Copilot Instructions](.github/copilot-instructions.md) - Repository-wide Copilot configuration
