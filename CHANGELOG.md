# EXPENSES WEB

This document contains the change log of the Expenses Web App. from its very first version.

## [0.5.0] 2026-05-20
### Added
- Table to display all transactions not making distinction between specific accounts.

### Changed
- Converting transaction description to upper case before saving.

## [0.4.2] 2026-05-17
### Added
- destination account field added to the transaction creation form.

### Changed
- Visual distribution of fields in the transaction creation from.
- Placeholder deleted from form fields
- Changed transaction name fields (type, source_id) to (transaction_type_id, source_account_id)

## [0.4.1] 2026-05-16
### Added
- IAccountDisplay created for account display in table.
- Implemented the account types and currencies from indexedDB in the form for account creation.

### Changed
- Deleted the currency mapper.
- Added property updated_at in accounts for future implementation of edition

### Fixed
- Changed if/else notation in the table component to match the current Angular syntax.

## [0.4.0] 2026-05-16
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