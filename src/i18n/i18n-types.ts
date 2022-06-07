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
	/**
	 * change cube setting
	 */
	'change cube setting': string
	/**
	 * renew scramble
	 */
	'renew scramble': string
	/**
	 * corner buffer
	 */
	'corner buffer': string
	/**
	 * edge buffer
	 */
	'edge buffer': string
	/**
	 * edge execution
	 */
	'edge execution': string
	/**
	 * corner execution
	 */
	'corner execution': string
	/**
	 * choose from presets
	 */
	'choose from presets': string
	/**
	 * use this preset
	 */
	'use this preset': string
	/**
	 * save setting
	 */
	'save setting': string
	/**
	 * back to practice without save setting
	 */
	'back to practice without save setting': string
	/**
	 * click and change labels
	 */
	'click and change labels': string
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
	/**
	 * change cube setting
	 */
	'change cube setting': () => LocalizedString
	/**
	 * renew scramble
	 */
	'renew scramble': () => LocalizedString
	/**
	 * corner buffer
	 */
	'corner buffer': () => LocalizedString
	/**
	 * edge buffer
	 */
	'edge buffer': () => LocalizedString
	/**
	 * edge execution
	 */
	'edge execution': () => LocalizedString
	/**
	 * corner execution
	 */
	'corner execution': () => LocalizedString
	/**
	 * choose from presets
	 */
	'choose from presets': () => LocalizedString
	/**
	 * use this preset
	 */
	'use this preset': () => LocalizedString
	/**
	 * save setting
	 */
	'save setting': () => LocalizedString
	/**
	 * back to practice without save setting
	 */
	'back to practice without save setting': () => LocalizedString
	/**
	 * click and change labels
	 */
	'click and change labels': () => LocalizedString
}

export type Formatters = {}
