
import { useState } from 'react'
import './App.css'
import { CompareChart } from './CompareChart'
import { Textarea } from "@/components/ui/textarea"
import { Benchmark } from './types/benchmark'


function App() {
  const [benchmarks, setBenchmarks] = useState<Benchmark[] | undefined>([])

  return (
  
      <div className='flex flex-row flex-1 w-dvw p-8'>
        <div className='flex-1' style={{flex: 1}}>
          <Textarea onChange={(e) => {
            
            try {
              const value = JSON.parse(e.currentTarget.value)
              setBenchmarks(value.benchmarks)
            } catch (e) {
              console.error(e)
            }
          }} />
        </div>
        <div className='flex flex-1' style={{flex: 2}}>
          <div>
            <CompareChart  benchmarks={benchmarks} />
          </div>
        </div>
      </div>
  
  )
}

export default App
