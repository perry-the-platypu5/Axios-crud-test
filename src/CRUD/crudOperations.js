import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { FaRegEdit,FaRegTrashAlt } from "react-icons/fa";
function CrudOperations() {
    const [stocks, setStocks] = useState([]);
    const [org, setOrg] = useState('');
    const [ticker, setTicker] = useState('');
    const [editingStock, setEditingStock] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8888/stock/read')
          .then(response => {
            setStocks(response.data);
          })
          .catch(error => {
            console.error('There was an error fetching the stocks!', error);
          });
      }, []);
      
      // Create a new stock
    const createStock = () => {
        axios.post('http://localhost:8888/stock/add', {
          org,
          ticker,
        })
        .then(response => {
          setStocks([...stocks, response.data]);
          setOrg('');
          setTicker('');
        })
        .catch(error => {
          console.error('There was an error creating the stock!', error);
        });
      };
       // Update a stock
    const updateStock = (stock) => {
      console.log("updateStock");
        console.log(stock);
        axios.put(`http://localhost:8888/stock/update/${stock.id}`, stock)
          .then(response => {
            setStocks(stocks.map(p => (p.id === stock.id ? response.data : p)));
            setEditingStock(null);
            setOrg('');
            setTicker('');
          })
          .catch(error => {
            console.error('There was an error updating the stock!', error);
          });
      };

      // Delete a stock
    const deleteStock = (id) => {
        axios.delete(`http://localhost:8888/stock/delete/${id}`)
          .then(() => {
            setStocks(stocks.filter(stock => stock.id !== id));
          })
          .catch(error => {
            console.error('There was an error deleting the stock!', error);
          });
      };

      const handleEditClick = (stock) => {
        console.log("handleEditClick");
        console.log(stock);
        setEditingStock(stock);
        setOrg(stock.org);
        setTicker(stock.ticker);
      };
    
      const handleSaveClick = () => {
        if(document.getElementById('org').value!=''&&document.getElementById('ticker').value!=''){
          console.log("handleSaveClick");
          console.log(editingStock);
          console.log(org, ticker);
          if (editingStock) {
            updateStock({ ...editingStock, ticker, org });
          } else {
            createStock();
          }
        }   
      };

      function validationOrg(){
        const val = document.getElementById('org').value;
        if(val==''){
          document.getElementById('orgw').innerHTML='Org cannot be empty';
        }
        else{
          document.getElementById('orgw').innerHTML='';
        }
      }
      function validationTicker(){
        const val = document.getElementById('ticker').value;
        if(val==''){
          document.getElementById('tickerw').innerHTML='Ticker cannot be empty';
        }
        else{
          document.getElementById('tickerw').innerHTML='';
        }
      }

      return (
        <div>
        <h1>CRUD on Stocks</h1>
        <div className="row justify-content-evenly m-4">
          <div className='col' style={{maxWidth:"40rem",marginTop:"6rem"}}>
          <input
              type="text"
              placeholder="Ticker"
              className='form-control m-2 mb-4'
              id='ticker'
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              onInput={validationTicker}
              data-testid="tickerInput"
            />
            <p id="tickerw" style={{color:"red"}}>Ticker cannot be empty</p>
            <input
              type="text"
              placeholder="Org"
              id='org'
              className='form-control m-2 mt-4'
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              onInput={validationOrg}
              data-testid="orgInput"
            />
            <p id='orgw' style={{color:"red"}}>Org cannot be empty</p>
            
            <button onClick={handleSaveClick} className="btn btn-success mt-4" id="saveBtn">
              {editingStock ? 'Update Stock' : 'Add Stock'}
            </button>
          </div>
          <div className='col'>
          <table className='table table-striped m-5 mt-3'>
            <thead>
              <tr>
                  <th><h1 className='display-6'>Ticker</h1></th>
                  <th><h1 className='display-6'>Organization</h1></th>
              </tr>
              </thead>
              <tbody>
            {stocks.map(stock => (
              <tr key={stock.id}>
                <td><p >{stock.ticker}</p></td>
                <td><p>{stock.org}</p></td>
                <td><button name="editBtn" data-testid="editBtn" className="btn btn-warning" style={{"display":"flex","padding":"0.5rem"}} onClick={() => handleEditClick(stock)}><FaRegEdit/></button></td>
                <td><button name="deleteBtn" className="btn btn-danger" style={{"display":"flex","padding":"0.5rem"}} onClick={() => deleteStock(stock.id)}><FaRegTrashAlt /></button></td>
              </tr>
            ))}
            </tbody>
          </table>
          </div>
        </div>
        </div>
      );
}

export default CrudOperations;