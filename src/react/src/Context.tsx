import * as React from 'react'

const CopyContext = React.createContext<ContextProps>({})

type ContextProps = {}

type Props = { children: React.ReactNode, copy: object }

const CopyProvider: React.FunctionComponent<Props> = ({ copy, children }) => {
	return <CopyContext.Provider value={copy}>{children}</CopyContext.Provider>
}

export { CopyContext, CopyProvider }
