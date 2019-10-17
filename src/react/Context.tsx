import React from 'react'

const CopyContext = React.createContext(null)

const CopyProvider = ({ copy, children }) => {
	return <CopyContext.Provider value={copy}>{children}</CopyContext.Provider>
}

export { CopyContext, CopyProvider }
