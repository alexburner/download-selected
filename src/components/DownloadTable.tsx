import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import { FaDownload } from 'react-icons/fa'
import { TableItem } from '../data'
import { capitalize } from '../util'

type SelectedNames = Set<TableItem['name']>

export const DownloadTable: FC<{ items: TableItem[] }> = ({ items }) => {
  const [selectedNames, setSelectedNames] = useState<SelectedNames>(new Set())

  /**
   * Toggle a name's selected state
   */
  const toggleName = (name: TableItem['name']) => {
    const nextSelectedNames = new Set(selectedNames)
    selectedNames.has(name)
      ? nextSelectedNames.delete(name)
      : nextSelectedNames.add(name)
    setSelectedNames(nextSelectedNames)
  }

  /**
   * "Download" all selected items
   *
   * Note: only status=available items are downloaded.
   * This could also be achieved more structurally through the UI, by disabling
   * hover & selection of !available items. However, the mockup showed !available
   * items as still having enabled checkboxes and hover states.
   */
  const downloadItems = () => {
    const availableItems: TableItem[] = []
    const unavailableItems: TableItem[] = []
    items.forEach((item) => {
      if (!selectedNames.has(item.name)) return
      item.status === 'available'
        ? availableItems.push(item)
        : unavailableItems.push(item)
    })

    const lines: string[] = []
    if (availableItems.length) {
      lines.push('Downloading available items:')
      availableItems.forEach((item) =>
        lines.push(`  ${item.device}: ${item.path}`),
      )
      // Fence post
      if (unavailableItems.length) lines.push('')
    }
    if (unavailableItems.length) {
      lines.push('Skipping unavailable items:')
      unavailableItems.forEach((item) =>
        lines.push(`  ${item.device}: ${item.path}`),
      )
    }

    const message = lines.join('\n')
    alert(message)
  }

  return (
    <div className="download-table">
      <div className="header">
        <div className="select-all">
          <label>
            <SelectAllCheckbox
              allNames={items.map((item) => item.name)}
              selectedNames={selectedNames}
              setSelectedNames={setSelectedNames}
            />
            &nbsp;{' '}
            {selectedNames.size > 0
              ? `Selected ${selectedNames.size}`
              : 'None Selected'}
          </label>
        </div>
        {selectedNames.size > 0 && (
          <div>
            <button onClick={downloadItems}>
              <FaDownload />
              &nbsp; Download Selected
            </button>
          </div>
        )}
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
            <tr
              key={item.name}
              className={selectedNames.has(item.name) ? 'selected' : ''}
              onClick={() => toggleName(item.name)}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedNames.has(item.name)}
                  onChange={() => toggleName(item.name)}
                />
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

const SelectAllCheckbox: FC<{
  allNames: TableItem['name'][]
  selectedNames: SelectedNames
  setSelectedNames: Dispatch<SetStateAction<SelectedNames>>
}> = ({ allNames, selectedNames, setSelectedNames }) => {
  const checkboxRef = useRef<HTMLInputElement>(null)

  const allNamesSelected = selectedNames.size === allNames.length
  const someNamesSelected = !allNamesSelected && selectedNames.size > 0

  useEffect(() => {
    if (!checkboxRef.current) return
    // Set checkbox as "indeterminate" if only some items are selected
    checkboxRef.current.indeterminate = someNamesSelected
  }, [someNamesSelected])

  return (
    <input
      ref={checkboxRef}
      type="checkbox"
      checked={allNamesSelected}
      onChange={(e) => {
        // Select all or none
        e.target.checked
          ? setSelectedNames(new Set(allNames))
          : setSelectedNames(new Set())
      }}
    />
  )
}

const StatusCell: FC<{ status: TableItem['status'] }> = ({ status }) => (
  <div className="status-cell">
    {capitalize(status)}
    {status === 'available' && <div className="available-dot" />}
  </div>
)
