# EXPENSES WEB

This document contains the change log of the Expenses Web App. from its very first version.

## [0.13.1] 2026-10-22
### Changed
- Changed which columns look narrow in the accounts table
- Category field in transaction is filtered depending on the type of transaction

## [0.13.0] 2026-10-21
### Added
- Added date field to accounts
- Added actions column in the account table
- Added edition and soft deletion of accounts.
- Added the updated_at column to the account CSV export file

### Changed
- Changed the created_at column for date column

## [0.12.0] 2026-10-21
### Added
- Added filters component to work with the table and implemented it in transactions and accounts pages

### Changed
- Transaction form becomes disabled if there are not accounts or categories to choose from

### Fixed
- Date format for account creation date in account list

## [0.11.0] 2026-10-20
### Added
- Added category to transaction forms
- Added internationalization for changes

### Changed
- Updated the DexieDB scheme to add more indexed fields for future filters and to add the category_id field to the existing transactions.

### Fixed
- Fixed visual bug that caused the actions of a modal to show right below the body of the modal instead of being displayed at the bottom of the modal

## [0.10.1] 2026-10-20
### Added
- Added edition and deletion of categories

### Changed
- Included the visualization of the active row in the category table

## [0.10.0] 2026-10-20
### Added
- Added `Table card` component as reusable to display a lite table in the administration page
- Added categories interfaces and types.
- Export functionality for categories

### Changed
- Added new translations for administration page.

## [0.9.1] 2026-10-19
### Added
- Added extra validations in transaction form to disable an account from being selected as source or destination whenever the same account was selected in the other field.
- Added extra validation to disable the save button in forms if the form is invalid in all forms.
- Added extra validation to prevent the selection of dates in the future.

### Changed
- Moved modal styles to global styles to remove duplicated styles.

## [0.9.0] 2026-10-16
### Added
- Added edit and delete buttons to the transactions table
- Added internationalization for the settings page
- Added tooltips to al FABs
- Added a generic modal for confirmation of actions

### Changed
- Added created_at and updated_at fields for transactions
- Added the last update column in the transactions table
- Added active column to transactions for soft deletion

## [0.8.0] 2026-10-14
### Added
- Added ngx-translate for app translation
- Added Configuration tab with language setting
- Added translations for English, Spanish and Portuguese
- Added required validators for account and transaction forms

### Changed
- Changed templates to adapt to translation files

### Removed
- CRUD for account types, currencies and transaction types

## [0.7.0] 2026-10-14
### Added
- Style for transfers in transaction list added

### Changed
- Logic for balance calculation is changed to include the different transaction types

### Fixed
- Fixed typo in styles for incomes in transaction list

## [0.6.0] 2026-07-09
## Changed
- Account table show current balance based on transactions made.

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