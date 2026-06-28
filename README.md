# filemaker-cli

A cross-platform CLI tool that scaffolds files and folders instantly,
either from a structure.txt blueprint or an interactive prompt.

Installs as `filemaker-cli`, runs as `filemaker`.

## Install

```
npm install -g filemaker-cli
```

## Usage

```
cd any/project/folder
filemaker
```

If a structure.txt file exists in the current directory, filemaker reads
it and builds everything listed, line by line. Otherwise it asks what
you want to build.

```
filemaker --dry-run     show what would be created without touching disk
filemaker --version     print the installed version
filemaker --help        show usage info
```

## structure.txt format

```
src/
src/index.js
src/utils/helpers.js
.env
.gitignore
LICENSE
README.md
```

One entry per line. Lines ending in / are always folders. Anything
starting with a dot, like .env or .gitignore, is always a file. Names
with a real extension are files too. A handful of common extension-less
filenames (LICENSE, Dockerfile, Makefile, README, CHANGELOG, and similar)
are recognized as files as well. Everything else is treated as a folder.
Blank lines and lines starting with # are ignored.

## Comma mode example

```
What do you want to build? (Separate items with commas)
> src/, src/index.js, .env, .gitignore, README.md
```

## Safety

filemaker only ever creates things inside the folder you ran it from.
Any entry that tries to escape that folder (using ../ or an absolute
path) gets skipped and reported, not silently followed.

Running filemaker again over an existing structure won't overwrite
anything. Items that already exist are left alone and marked
"[already there]".

## Exiting

Press Ctrl+C at any time to exit cleanly:

```
Closing safely... Take care!
```
