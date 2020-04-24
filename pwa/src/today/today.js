import React, { Component } from 'react'
import axios from 'axios'
import Pusher from 'pusher-js'


export default class Today extends Component {
    constructor(props) {
        super(props)
        this.state = {
            btc: '',
            ltc: '',
            eth: ''
        }
    }
    componentDidMount() {
        if (!navigator.onLine) {
            this.setState({ btc: localStorage.getItem('BTC') });
            this.setState({ eth: localStorage.getItem('ETH') });
            this.setState({ ltc: localStorage.getItem('LTC') });
        }

        setInterval(() => {
            axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,LTC&tsyms=USD')
                .then(response => {
                    this.sendPricePusher(response.data)
                })
                .catch(e => {
                    console.log(e)
                })

        }, 10000)

        this.prices.bind('prices', price => {
            this.setState({ btc: price.prices.BTC.USD });
            this.setState({ eth: price.prices.ETH.USD });
            this.setState({ ltc: price.prices.LTC.USD });
        }, this);
    }

    sendPricePusher(data) {
        axios.post('/prices/new', {
            prices: data
        })
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
    }

    componentWillMount() {
        axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,LTC&tsyms=USD')
            .then(response => {
                this.setState({ btc: response.data.BTC.USD, ltc: response.data.LTC.USD, eth: response.data.ETH.USD })
                localStorage.setItem('BTC', response.data.BTC.USD);
                localStorage.setItem('ETH', response.data.ETH.USD);
                localStorage.setItem('LTC', response.data.LTC.USD);
            })
            .catch(e => {
                console.log(e)
            })

        this.Pusher = new Pusher({

            app_id: '587127',
            key: 'cb669af1165d942081a5',
            secret: 'a0cbd1c2e9c629300cc6',
            cluster: 'ap1',
            encrypted: true
        })
        this.prices = this.Pusher.subscribe('coin-prices')
    }
    render() {
        return (
            <div>
                <div className="today--section container">
                    <h2>Current Price</h2>
                    <div className="columns today--section__box">
                        <div className="column btc--section">
                            <h5>${this.state.btc}</h5>
                            <p>1 BTC</p>
                        </div>
                        <div className="column eth--section">
                            <h5>${this.state.eth}</h5>
                            <p>1 ETH</p>
                        </div>
                        <div className="column ltc--section">
                            <h5>${this.state.ltc}</h5>
                            <p>1 LTC</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
