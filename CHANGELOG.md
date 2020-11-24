# Change log

This project follows [Semantic Versioning](http://semver.org/).

## [27.0.0] 2020-11-20
### Changed
- Updates FHIR Questionnaire definitions to use the observationExtract
  extension if an observationLinkPeriod is used.

## [26.0.1] 2020-11-20
### Changed
- The list of update versions is now determined at build time, rather than being
  a hard-coded list.

## [26.0.0] 2020-09-18
### Changed
- Handles the new defaults for templateOptions in LForms 26. Form controls
  and the header are hidden by default in version 26. This preserves the
  previous behavior unless templateOptions are explicitly specified.

## [25.0.1] 2020-06-18
### Fixed
- Updated the lforms peer dependency to 25.0.0.

## [25.0.0] 2020-06-17
### Changed
- Handles the update of the calculatedExpression URI in LForms 25.

## [24.0.0] 2020-04-09
### Added
- Add linkId for each item in LForms, and convert questionCode to linkId in
  skipLogic, dataControl and calculationMethod.

## [23.0.2] 2020-03-31
### Fixed
- The browser-ready file now assigns the lformsUpdater to the "window" object.
  Previously it was just an implicit global, which caused an error if bundled
  into a strict-mode file.

## [23.0.1] 2020-03-26
### Added
- Removed the extension for answer repeats and replaced it with 'repeats' on items.
  This is another part of the changes for lforms 23.0.0.

## [23.0.0] 2020-03-20
### Added
- Now handles the breaking changes in lforms version 23.
- The update function now takes an optional argument that is the version number
  to update to.  Without it, it updates to the latest version the package knows
  about.
### Changed
- Decided to keep this package's version number in sync with the lforms version
  number.
