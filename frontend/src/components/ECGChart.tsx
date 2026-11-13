
import Plot from 'react-plotly.js'
import type { ECGPoint } from '../types/ecg'
import type * as Plotly from 'plotly.js'

interface ECGChartProps {
  data: ECGPoint[]
  filteredData?: ECGPoint[]
}

function ECGChart({ data, filteredData }: ECGChartProps) {
  const timeValues = data.map(point => point.time)
  const ecgValues = data.map(point => point.ecg)


  const traces: Plotly.Data[] = [
    {
      x: data.map(point => point.time),
      y: data.map(point => point.ecg),
      type: 'scatter',
      mode: 'lines',
      name: 'Signal brut',
      line: {
        color: '#94a3b8',
        width: 1.5,
      },
    },
  ]

  if (filteredData && filteredData.length > 0) {
    traces.push({
      x: filteredData.map(point => point.time),
      y: filteredData.map(point => point.ecg),
      type: 'scatter',
      mode: 'lines',
      name: 'Signal filtré',
      line: {
        color: '#176b87',
        width: 2,
      },
    })
  }


  
  return (
    <div className="ecg-chart">
      <h3>Visualisation du signal ECG</h3>

      <Plot
        data={traces}
        layout={{
          title: {
            text: 'Signal ECG importé'
          },
          xaxis: {
            title: {
              text: 'Temps (s)'
            }
          },
          yaxis: {
            title: {
              text: 'Amplitude (unité ..)'
            }
          },
          autosize: true,
          margin: {
            l: 75,
            r: 25,
            t: 60,
            b: 65
          },
          paper_bgcolor: '#ffffff',
          plot_bgcolor: '#ffffff'
        }}
        config={{
          responsive: true,
          displaylogo: false
        }}
        style={{
          width: '100%',
          height: '450px'
        }}
        useResizeHandler
      />
    </div>
  )
}

export default ECGChart
