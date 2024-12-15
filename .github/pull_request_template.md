## Describe your changes

- I did an awesome feature.

## Issue ticket code (and/or) and link

- [Link to JIRA ticket](#https://ticket-url)

### **General**

- [x] Assigned myself to the PR
- [ ] Assigned the appropriate labels to the PR
- [x] Assigned the appropriate reviewers to the PR
- [x] Updated the documentation
- [x] Performed a self-review of my code
- [x] Types for input and output parameters
- [x] Don't have "any" on my code
- [x] Used the try/catch pattern for error handling
- [x] Don't have magic numbers
- [x] Compare only with constants not with strings
- [x] No ternary operator inside the ternary operator
- [x] Don't have commented code
- [x] no links in the code, env links should be in env file (for example: server url), constant links (for example default avatar URL) should be in constant file.
- [x] Used camelCase for variables and functions
- [x] Date and time formats are on the constants
- [x] Functions are public only if it's used outside the class
- [x] No hardcoded values
- [ ] covered by tests
- [x] Check your commit messages meet the [conventional commit format](https://www.conventionalcommits.org/en/v1.0.0/).

### Backend

- [x] Swagger documentation updated
- [x] Database requests are optimized and not redundant
- [ ] Unit tests written
- [x] use ConfigService instead of process.env
- [x] use transactions if there is a call chain that mutates data in different tables
- [x] use @index decorator for frequently requested data