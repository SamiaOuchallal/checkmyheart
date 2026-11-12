
import Plot from 'react-plotly.js'
import type { ECGPoint } from '../types/ecg'

interface ECGChartProps {
  data: ECGPoint[]
}

function ECGChart({ data }: ECGChartProps) {
  const timeValues = data.map(point => point.time)
  const ecgValues = data.map(point => point.ecg)

  return (
    <div className="ecg-chart">
      <h3>Visualisation du signal ECG</h3>

      <Plot
        data={[
          {
            x: timeValues,
            y: ecgValues,
            type: 'scatter',
            mode: 'lines',
            name: 'Signal ECG',
            line: {
              color: '#176b87',
              width: 2
            }
          }
        ]}
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
