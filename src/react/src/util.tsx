const exists = value => value !== undefined && value !== null

const getKey = (keys: Record<string, any>, obj: Record<string, any>) =>
	obj && keys.length ? getKey(keys.slice(1), obj[keys[0]]) : obj

const get = (key: string, fallback = '') => (obj: Record<string, any>) => {
	const keys = String(key).split('.')
	if (!exists(obj)) {
		return fallback
	}
	const result = getKey(keys, obj)

	return result === undefined ? fallback : result
}

const interpolate = (str, data = {}) =>
	str.replace(/{([^{}]*)}/g, (variableName) =>
		exists(data[variableName]) ? data[variableName] : variableName
	)

export const getCopy = (copy, key, params = {}, fallback) => {
	const thisKey = key
	const thisNode = get(key)(copy)
	switch (typeof thisNode) {
		case 'string':
			return interpolate(thisNode, params)

		case 'object':
			return Object.keys(thisNode).reduce((copies, key) => {
				const node = get(key)(thisNode)
				return Object.assign(copies, {
					[key]:
						typeof node === 'string'
							? interpolate(node, params)
							: getCopy(copy,
								`${thisKey}.${key}`,
								params,
								fallback
							)
				})
			}, {})

		default:
			return thisNode || fallback || thisKey
	}

}


export const getFullCopyKey = (copyBase: string | undefined, copyKey: string) =>
	copyBase ? `${copyBase}.${copyKey}` : copyKey

export default { getCopy }
