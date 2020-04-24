import React, { Component } from 'react'
import moment from 'moment'
import axios from 'axios'


export default class history extends Component {
    constructor(props) {
        super(props)
        this.state = {
            todays: {},
            yesterdays: {},
            daybeforeyesterday: {},
            twodaybeforeyesterday: {}

        }
        this.getBTCPrices = this.getBTCPrices.bind(this)
        this.getETHPrices = this.getETHPrices.bind(this)
        this.getLTCPrices = this.getLTCPrices.bind(this)
    }

    getETHPrices(date) {
        return axios('https://min-api.cryptocompare.com/data/pricehistorical?fsym=ETH&tsyms=USD&ts=' + date)
    }
    getBTCPrices(date) {
        return axios('https://min-api.cryptocompare.com/data/pricehistorical?fsym=BTC&tsyms=USD&ts=' + date)
    }
    getLTCPrices(date) {
        return axios('https://min-api.cryptocompare.com/data/pricehistorical?fsym=LTC&tsyms=USD&ts=' + date)
    }



    getPrice(day, value) {
        let t = moment().subtract(day, 'days').unix()
        axios.all([this.getBTCPrices(t), this.getETHPrices(t), this.getLTCPrices(t)])
            .then(axios.spread((btc, eth, ltc) => {
                let f = {
                    date: moment.unix(t).format("MMMM Do YYYY"),
                    eth: eth.data.ETH.USD,
                    btc: btc.data.BTC.USD,
                    ltc: ltc.data.LTC.USD
                }
                this.setState({ [value]: f })
                localStorage.setItem([value], JSON.stringify(f));
            }))
    }
    componentDidMount() {
        if (!navigator.onLine) {
            this.setState({ todays: JSON.parse(localStorage.getItem('todayprice')) });
            this.setState({ yesterdays: JSON.parse(localStorage.getItem('yesterdayprice')) });
            this.setState({ daybeforeyesterday: JSON.parse(localStorage.getItem('twodaysprice')) });
            this.setState({ twodaybeforeyesterday: JSON.parse(localStorage.getItem('threedaysprice')) });
        }
    }


    componentWillMount() {
        this.getPrice(0, 'todays')
        this.getPrice(1, 'yesterdays')
        this.getPrice(2, 'daybeforeyesterday')
        this.getPrice(3, 'twodaybeforeyesterday')
        console.log(this.state)
    }
    render() {
        return (
            <div>

                <div className="history--section container">
                    <h2>History (Past 5 days)</h2>
                    <div className="history--section__box">
                        <div className="history--section__box__inner">
                            <h4>{this.state.todays.date}</h4>
                            <div className="columns">
                                <div className="column">
                                    <p>1 BTC = ${this.state.todays.btc}</p>
                                </div>
                                <div className="column">
                                    <p>1 ETH = ${this.state.todays.eth}</p>
                                </div>
                                <div className="column">
                                    <p>1 LTC = ${this.state.todays.ltc}</p>
                                </div>
                            </div>
                        </div>
                        <div className="history--section__box__inner">
                            <h4>{this.state.yesterdays.date}</h4>
                            <div className="columns">
                                <div className="column">
                                    <p>1 BTC = ${this.state.yesterdays.btc}</p>
                                </div>
                                <div className="column">
                                    <p>1 ETH = ${this.state.yesterdays.eth}</p>
                                </div>
                                <div className="column">
                                    <p>1 LTC = ${this.state.yesterdays.ltc}</p>
                                </div>
                            </div>
                        </div>
                        <div className="history--section__box__inner">
                            <h4>{this.state.daybeforeyesterday.date}</h4>
                            <div className="columns">
                                <div className="column">
                                    <p>1 BTC = ${this.state.daybeforeyesterday.btc}</p>
                                </div>
                                <div className="column">
                                    <p>1 ETH = ${this.state.daybeforeyesterday.eth}</p>
                                </div>
                                <div className="column">
                                    <p>1 LTC = ${this.state.daybeforeyesterday.ltc}</p>
                                </div>
                            </div>
                        </div>
                        <div className="history--section__box__inner">
                            <h4>{this.state.twodaybeforeyesterday.date}</h4>
                            <div className="columns">
                                <div className="column">
                                    <p>1 BTC = ${this.state.twodaybeforeyesterday.btc}</p>
                                </div>
                                <div className="column">
                                    <p>1 ETH = ${this.state.twodaybeforeyesterday.eth}</p>
                                </div>
                                <div className="column">
                                    <p>1 LTC = ${this.state.twodaybeforeyesterday.ltc}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}
