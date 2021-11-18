import React from 'react'

export class Error extends React.Component {
    constructor(props) {
        super(props)
        this.state = false
    }
    
    static getDerivedStateFromError(error) {
        this.state = true
        return this.state
    }

    render() {
        return this.state? <h1>An error has occured, Refresh the page</h1>: this.props.children
    }
}