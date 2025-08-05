import React, { useState, useMemo } from 'react';
import '../App.css';

const DataTable = ({ 
  data, 
  columns, 
  title, 
  onDelete, 
  onAdd,
  showAddForm = false,
  addFormData = {},
  onAddFormChange,
  onAddFormSubmit
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const initial = {};
    columns.forEach(col => {
      initial[col.key] = true;
    });
    return initial;
  });

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(item =>
      Object.keys(item).some(key => {
        const value = item[key];
        if (value === null || value === undefined) return false;
        return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm]);

  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <div className="table-container">
        <div className="table-header">
          <h2>{title}</h2>
        </div>
        <div className="no-data">
          No data available.
        </div>
      </div>
    );
  }



  const toggleColumn = (columnKey) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  const toggleAllColumns = () => {
    const allVisible = Object.values(visibleColumns).every(v => v);
    const newState = {};
    columns.forEach(col => {
      newState[col.key] = !allVisible;
    });
    setVisibleColumns(newState);
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>{title}</h2>
        
        {/* Search and Controls */}
        <div className="table-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="column-toggles">
            <button 
              onClick={toggleAllColumns}
              className="toggle-all-btn"
            >
              {Object.values(visibleColumns).every(v => v) ? 'Hide All' : 'Show All'}
            </button>
            
            <div className="column-toggle-buttons">
              {columns.map(col => (
                <button
                  key={col.key}
                  onClick={() => toggleColumn(col.key)}
                  className={`toggle-btn ${visibleColumns[col.key] ? 'active' : 'inactive'}`}
                >
                  {col.label}
                </button>
              ))}
            </div>
          </div>
          
          {showAddForm !== undefined && (
            <button 
              onClick={() => onAddFormSubmit && onAddFormSubmit({ preventDefault: () => {}, type: 'toggle' })}
              className="add-toggle-btn"
            >
              {showAddForm ? 'Hide Add Form' : 'Show Add Form'}
            </button>
          )}
        </div>
      </div>



      {/* Add Form */}
      {showAddForm && (
        <div className="add-form">
          <h3>Add New {title.slice(0, -1)}</h3>
          <form onSubmit={onAddFormSubmit}>
            {columns.filter(col => col.key !== 'id' && col.editable !== false).map(col => (
              <div key={col.key} className="form-group">
                <label>{col.label}:</label>
                <input
                  type={col.type || 'text'}
                  name={col.key}
                  value={addFormData[col.key] || ''}
                  onChange={onAddFormChange}
                  required
                />
              </div>
            ))}
            <button type="submit" className="add-btn">Add</button>
          </form>
        </div>
      )}

      {/* Table */}
      <table>
        <thead>
          <tr>
            {columns.map(col => 
              visibleColumns[col.key] && (
                <th key={col.key}>{col.label}</th>
              )
            )}
            {onDelete && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={item.id || index}>
              {columns.map(col => 
                visibleColumns[col.key] && (
                  <td key={col.key}>
                    {col.render ? col.render(item[col.key], item) : (item[col.key] !== undefined && item[col.key] !== null ? item[col.key] : '')}
                  </td>
                )
              )}
              {onDelete && (
                <td>
                  <button
                    className="button delete-btn"
                    onClick={() => onDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredData.length === 0 && (
        <div className="no-data">
          {searchTerm ? 'No results found for your search.' : 'No data available.'}
        </div>
      )}
    </div>
  );
};

export default DataTable; 