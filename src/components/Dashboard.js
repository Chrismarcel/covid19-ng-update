import React, { useState, useEffect } from 'react'
import MapChart from './MapChart'
import SummmaryPanel from './SummaryBlock'
import SummaryTable from './SummaryTable'
import socketClient from 'socket.io-client'
import dotenve from 'dotenv'

dotenve.config()

const socket = socketClient(process.env.HOST)

const initialState = {
  total: {
    confirmedCases: 0,
    death: 0,
    discharged: 0
  }
}

const Dashboard = () => {
  const [stats, setStats] = useState(initialState)
  const { total } = stats

  useEffect(() => {
    if (window.__INITIAL_DATA__) {
      const initialData = window.__INITIAL_DATA__
      setStats(initialData)
      delete window.__INITIAL_DATA__
    }
    socket.on('updated cases', ({ message: stats }) => {
      setStats(stats)
    })
  }, [stats])

  return (
    <main className="dashboard">
      <h1 className="dashboard-title">Covid-19 NG Report</h1>
      <SummmaryPanel total={total} />
      <section className="map-stats-wrapper">
        <MapChart stats={stats} />
        <SummaryTable stats={stats} />
      </section>
    </main>
  )
}

export default Dashboard
