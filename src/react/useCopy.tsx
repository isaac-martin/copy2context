import { useContext } from 'react'
import { CopyContext } from './Context'
import util, { getFullCopyKey } from './utils'

const useCopy = (copyBase?: string) => {
	const copy = useContext(CopyContext)

	if (!copy) {
		console.error(
			'No copy available in context, is your setContext setup correctly?'
		)
		return {
			getCopy: (copyKey: string) => copyKey,
			getCopyArray: (copyKey: string) => [copyKey, copyKey],
		}
	}

	const sharedGetCopy = (copyKey: string, params: Record<string, any>, fallback: string): string | Record<string, any> => util.getCopy(copy, getFullCopyKey(copyBase, copyKey), params, fallback)


	const getCopy = (copyKey: string, params = {}, fallback = ''): string | Record<string, any> => sharedGetCopy(copyKey, params, fallback)


	const getCopyArray = (copyKey: string, params = {}, fallback = ''): string | Record<string, any> =>
		Object.values(sharedGetCopy(copyKey, params, fallback))


	return { getCopy, getCopyArray }
}

export default useCopy
