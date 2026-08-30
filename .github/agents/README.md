# Custom GitHub Copilot Agents

This directory contains custom agents for the MuseumCheck repository. These agents are specialized AI assistants that help with specific tasks in the development workflow.

## Available Agents

### 🔍 Museum Data Checker Agent
**File:** `museum-data-checker.agent.md`  
**Purpose:** Comprehensive data quality validation for museum data

**Capabilities:**
- Detects duplicate museum names and IDs
- Validates data integrity across all museum entries
- Checks image URLs and resource availability
- Verifies age-appropriate content for different age groups
- Performs systematic issue analysis
- Provides detailed reporting with exact counts and examples

**When to Use:**
- Before making changes to museum data
- After adding new museums
- When fixing data-related bugs
- During code reviews involving museum data
- When investigating data quality issues

**How to Invoke:**
The agent has `infer: true`, so it will automatically activate when:
- Working with files in `museums-data.js` or `museums/` directory
- Discussing data quality or validation
- Addressing bugs related to duplicate data
- Performing systematic analysis

You can also explicitly invoke it in GitHub Copilot Chat:
```
@museum-data-checker check for duplicate museums
```

Or in GitHub Copilot CLI:
```bash
gh copilot suggest -a museum-data-checker "validate museum data quality"
```

## Adding New Agents

To add a new custom agent:

1. Create a new `.agent.md` file in this directory
2. Add YAML frontmatter with configuration:
   ```yaml
   ---
   name: agent-name
   description: "Agent description"
   target: github-copilot
   tools:
     - read
     - search
     - edit
     - bash
   infer: true/false
   metadata:
     area: "domain"
   ---
   ```
3. Write detailed instructions in Markdown format
4. Test the agent by invoking it in your workflow
5. Update this README with agent documentation

## Agent Configuration Reference

### YAML Frontmatter Properties

- **name**: Display name for the agent (optional)
- **description**: Required, describes the agent's purpose  
- **target**: Where the agent runs (`vscode` or `github-copilot`)
- **tools**: List of allowed tools (`read`, `edit`, `search`, `bash`, etc.)
  - Use `["*"]` to enable all tools
  - Specify a list to restrict to specific tools
- **infer**: 
  - `true`: Copilot can automatically use this agent
  - `false`: Must be explicitly invoked
- **metadata**: Arbitrary key-value pairs for organization

### Available Tools

- `read`: Read files and view directories
- `edit`: Create and modify files
- `search`: Search code and patterns (grep, glob)
- `bash`: Execute shell commands
- `web_search`: Search the web for information
- `web_fetch`: Fetch web page content

## Best Practices

1. **Keep agents focused**: Each agent should have a clear, specific purpose
2. **Document thoroughly**: Provide detailed instructions and examples
3. **Test extensively**: Ensure agents work as expected before relying on them
4. **Use appropriate tools**: Only grant tools necessary for the agent's tasks
5. **Consider inference**: Set `infer: true` for domain-specific agents, `false` for specialized workflows

## References

- [GitHub Docs: Custom Agents Configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration)
- [GitHub Blog: Custom Agents for GitHub Copilot](https://github.blog/changelog/2025-10-28-custom-agents-for-github-copilot/)
- [MuseumCheck Copilot Instructions](../copilot-instructions.md)
