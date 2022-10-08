import { FC } from 'react'
import { FaDownload } from 'react-icons/fa'
import { TableItem } from '../data'
import { capitalize } from '../util'

export const DownloadTable: FC<{ items: TableItem[] }> = ({ items }) => {
  return (
    <div className="download-table">
      <div className="header">
        <div className="select-all">
          <input type="checkbox" />
          &nbsp; Selected X
        </div>
        <div>
          <button onClick={() => console.log('click')}>
            <FaDownload />
            &nbsp; Download Selected
          </button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th />
            <th>Name</th>
            <th>Device</th>
            <th>Path</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.name}>
              <td>
                <input type="checkbox" />
              </td>
              <td>{item.name}</td>
              <td>{item.device}</td>
              <td>{item.path}</td>
              <td>
                <StatusCell status={item.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const StatusCell: FC<{ status: TableItem['status'] }> = ({ status }) => (
  <div className="status-cell">
    {capitalize(status)}
    {status === 'available' && <div className="available-dot" />}
  </div>
)
