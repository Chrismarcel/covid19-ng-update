import React, { useState, useEffect } from 'react'
import MapChart from './MapChart'
import SummmaryPanel from './SummaryBlock'
import SummaryTable from './SummaryTable'

const initialState = {
  summary: {
    total_confirmed_cases: 0,
    discharged: 0,
    death: 0
  },
  cases: {}
}

const Dashboard = () => {
  const [stats, setStats] = useState(initialState)
  const { summary, cases } = stats

  useEffect(() => {
    if (window.__INITIAL_DATA__) {
      const initialData = window.__INITIAL_DATA__
      setStats(initialData)
      delete window.__INITIAL_DATA__
    } 

    const eventSource = new EventSource('/updates')
    eventSource.onmessage = ({ data }) => setStats(data) 
    
  }, [stats])

  return (
    <main className="dashboard">
      <h1 className="dashboard-title">Covid-19 NG Report</h1>
      <SummmaryPanel summary={summary} />
      <section className="map-states-wrapper">
        <MapChart cases={cases} />
        <SummaryTable cases={cases} />
      </section>
    </main>
  )
}

export default Dashboard
