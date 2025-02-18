import React, { useEffect } from 'react'
import mystyle from './css/Products.module.css'
import { useTables } from '../context/TableContext'
const Products = ({ menu, getMenu }) => {

    useEffect(() => {
        getMenu()
    }, [])

    const { handleDelete } = useTables();

    return (
        <div>
            <h1>Products page</h1>
            <table border={1} className={mystyle.table}>
                <thead>
                    <tr>

                        <th>Name</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                {menu.map((item) => {

                    return (
                        <tr>

                            <td>
                                <div className={mystyle.product}>
                                    {<img src={item.imageUrl} className={mystyle.dp} />}
                                    {<h4>{item.name}</h4>}
                                </div>

                            </td>
                            <td>{item.price}</td>
                            <td>{item.status}</td>
                            <td>
                                <div className={mystyle.actions}>
                                    <button>Edit</button>
                                    <button onClick={() => handleDelete(item._id)}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    )
                })}
            </table>
        </div>
    )
}

export default Products
