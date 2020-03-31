# Change log

This project follows [Semantic Versioning](http://semver.org/).


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
