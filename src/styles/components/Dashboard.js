import React from 'react'
import MapChart from './MapChart'
import covid19stats from '../../../server/cases.json'
import SummmaryPanel from './SummaryPanel'
import SummaryTable from './SummaryTable'

const { summary, cases } = covid19stats

const Dashboard = () => {
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
