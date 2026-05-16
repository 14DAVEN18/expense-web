# EXPENSES WEB

This document contains the change log of the Expenses Web App. from its very first version.

## [0.4.0] 2026-05-17 ?
### Added
- floating container for row actions in the Administration page.

### Changed
- Account type, transaction type and currency mappers were deleted.

## [0.3.0] 2026-05-15
### Added
- Administration Page.
- Cards to display existing account types, transaction types and currencies.
- added tables to indexedDV for account types, transaction types and currencies.
- Administration services structure with get methods for account types, transaction types and currencies.
- Environment file for environment constants.
- Component to create account types.
- Component to create transaction types.
- Component to create currencies.

### Changed
- Added selected class to the navbar to show clearly which option is selected

### Fixed
- Input types in the account component
- Removing unnecessary function calls from the account component's html

## [0.2.0] 2026-05-11

## Added
- Option in navbar to navigate to the accounts page.
- Accounts page.
- Modal window to create accounts.
- Storage of account information in indexedDB.
- Export of transaction information in CSV file.

## [0.1.0] 2026-05-11

### Added
- Top Navbar for navigation between screens.
- Routes for existing components.
- Home page
- Transaction page
- Modal window to create transactions.
- Storage of transaction information in indexedDB.
- Export of transaction information in CSV file.

## [0.0.0] 2026-05-08

Creation of the initial structure of the project.