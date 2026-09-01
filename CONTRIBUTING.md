# Contributing to NAYAYVAULT

## Code of Conduct

Be respectful, inclusive, and professional in all interactions.

## How to Contribute

### Reporting Issues
1. Check existing issues first
2. Provide detailed description
3. Include steps to reproduce
4. Add screenshots if applicable
5. Mention your environment (OS, Node version, etc.)

### Suggesting Features
1. Describe the feature clearly
2. Explain the use case
3. Provide examples if possible
4. Link related issues

### Submitting Pull Requests
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Test thoroughly
5. Commit with clear messages: `git commit -m "Add feature: description"`
6. Push to your fork: `git push origin feature/your-feature`
7. Create a Pull Request

## Development Guidelines

### Backend (Node.js/Express)
- Use async/await for async operations
- Implement proper error handling
- Add comments for complex logic
- Follow REST API conventions
- Validate all inputs
- Use environment variables for configuration

### Frontend (React)
- Use functional components with hooks
- Keep components focused and reusable
- Use meaningful variable names
- Add comments for complex logic
- Test responsive design
- Follow accessibility standards

### Database
- Use transactions for data integrity
- Add indexes for performance
- Document schema changes
- Test migrations thoroughly
- Plan for backward compatibility

### Security
- Never commit secrets or credentials
- Use bcrypt for passwords (never SHA-256)
- Validate all inputs
- Implement rate limiting
- Use HTTPS in production
- Keep dependencies updated

## Testing

- Test with all user roles
- Verify document upload and verification
- Check audit logs
- Test error scenarios
- Verify authorization

## Documentation

- Update README.md for major changes
- Update API.md for endpoint changes
- Add comments to complex code
- Include examples in documentation
- Update CHANGELOG

## Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/your-feature

# 2. Make changes and commit
git commit -m "Add feature: description"

# 3. Push to your fork
git push origin feature/your-feature

# 4. Create Pull Request on GitHub
# 5. Address review comments
# 6. Merge when approved
```

## Areas for Contribution

- Bug fixes
- Performance improvements
- Documentation enhancements
- UI/UX improvements
- Security hardening
- Test coverage
- Accessibility improvements
- Internationalization (i18n)

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Example:
```
feat(documents): add version comparison feature

Implement side-by-side comparison of document versions
with visual diff highlighting.

Closes #123
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style
- `refactor` - Code refactoring
- `test` - Test additions
- `chore` - Maintenance

## Review Process

1. Maintainers review your PR
2. Address any feedback
3. Request re-review if needed
4. Maintainer merges when approved

## License

By contributing, you agree your code will be licensed under the MIT License.

Thank you for contributing to NAYAYVAULT! 🙏
