// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */
import type { BaseTranslation as BaseTranslationType, LocalizedString, RequiredParams } from 'typesafe-i18n'

export type BaseTranslation = BaseTranslationType
export type BaseLocale = 'en'

export type Locales =
	| 'en'
	| 'ja'

export type Translation = RootTranslation

export type Translations = RootTranslation

type RootTranslation = {
	/**
	 * input time by typing
	 */
	'input time by typing': string
	/**
	 * input time
	 */
	'input time': string
	/**
	 * Import from csTimer
	 */
	'Import from csTimer': string
	/**
	 * use inspection
	 */
	'use inspection': string
	/**
	 * An error occurred during import
	 */
	'An error occurred during import': string
	/**
	 * Deleted
	 */
	Deleted: string
	/**
	 * Share record with scramble
	 */
	'Share record with scramble': string
	/**
	 * Language
	 */
	Language: string
	/**
	 * undo
	 */
	undo: string
	/**
	 * Delete session "{session}"? This action cannot be undone
	 * @param {string} session
	 */
	'Delete session "{session:string}"? This action cannot be undone': RequiredParams<'session'>
}

export type TranslationFunctions = {
	/**
	 * input time by typing
	 */
	'input time by typing': () => LocalizedString
	/**
	 * input time
	 */
	'input time': () => LocalizedString
	/**
	 * Import from csTimer
	 */
	'Import from csTimer': () => LocalizedString
	/**
	 * use inspection
	 */
	'use inspection': () => LocalizedString
	/**
	 * An error occurred during import
	 */
	'An error occurred during import': () => LocalizedString
	/**
	 * Deleted
	 */
	Deleted: () => LocalizedString
	/**
	 * Share record with scramble
	 */
	'Share record with scramble': () => LocalizedString
	/**
	 * Language
	 */
	Language: () => LocalizedString
	/**
	 * undo
	 */
	undo: () => LocalizedString
	/**
	 * Delete session "{session}"? This action cannot be undone
	 */
	'Delete session "{session:string}"? This action cannot be undone': (arg: { session: string }) => LocalizedString
}

export type Formatters = {}
