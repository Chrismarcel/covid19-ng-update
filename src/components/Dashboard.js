import React, { useState, useEffect } from 'react'
import MapChart from './MapChart'
import covid19stats from '../../server/cases.json'
import SummmaryPanel from './SummaryBlock'
import SummaryTable from './SummaryTable'

const Dashboard = () => {
  const [stats, setStats] = useState(() => covid19stats)
  const { summary, cases } = stats

  useEffect(() => {
    const eventSource = new EventSource('/updates')
    eventSource.onmessage = evt => console.log(evt.data)
  }, [])

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
