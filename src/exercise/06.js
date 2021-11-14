// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'

import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

class ErrorBoundary extends React.Component {
  state = {error: null}
  static getDerivedStateFromError(error) {
    return {error}
  }
  render() {
    const {error} = this.state
    if (error) {
      return <this.props.errComponent error={error} />
    }
    return this.props.children
  }
}

function errorComponent({error}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  )
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null,
  })

  const {status, error, pokemon} = state
  React.useEffect(() => {
    if (!pokemonName) return
    setState({status: 'request'})
    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setState({status: 'success', pokemon: pokemonData})
      })
      .catch(e => {
        setState({status: 'error', error: e})
      })
  }, [pokemonName])

  if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'error') {
    throw error
  } else if (status === 'request') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'success') {
    return <PokemonDataView pokemon={pokemon} />
  } else {
    throw new Error(`Unexpected state ${status}`)
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary errComponent={errorComponent}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
