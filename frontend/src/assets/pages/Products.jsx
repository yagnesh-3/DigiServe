import React, { useEffect, useState } from 'react';
import mystyle from './css/Products.module.css';
import { useTables } from '../context/TableContext';

const Products = () => {
    const { handleDelete, menu, getMenu, addNewItem, updateItem } = useTables();
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [newItem, setNewItem] = useState({
        name: '',
        price: '',
        imageUrl: '',
        ingredients: '',
    });

    const [editItem, setEditItem] = useState({
        id: '',
        name: '',
        price: '',
        imageUrl: '',
        ingredients: '',
    });

    useEffect(() => {
        getMenu();
    }, []);

    const handleNewItemChange = (e) => {
        const { name, value } = e.target;
        setNewItem({ ...newItem, [name]: value });
    };

    const handleEditItemChange = (e) => {
        const { name, value } = e.target;
        setEditItem({ ...editItem, [name]: value });
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        const formattedItem = {
            ...newItem,
            price: parseFloat(newItem.price),
            ingredients: newItem.ingredients.split(',').map((ing) => ing.trim()),
        };
        addNewItem(formattedItem);
        setShowAddForm(false);
        setNewItem({ name: '', price: '', imageUrl: '', ingredients: '' });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const formattedItem = {
            ...editItem,
            price: parseFloat(editItem.price),
            ingredients: editItem.ingredients.split(',').map((ing) => ing.trim()),
        };
        updateItem(selectedItem._id, formattedItem);
        setShowEditForm(false);
        setSelectedItem(null);
        setEditItem({ name: '', price: '', imageUrl: '', ingredients: '' });
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setEditItem({
            name: item.name,
            price: item.price.toString(),
            imageUrl: item.imageUrl,
            ingredients: item.ingredients.join(', '),
        });
        setShowEditForm(true);
    };

    return (
        <div className={mystyle.container}>
            <div className={mystyle.mainBar}>
                <h1 className={mystyle.heading}>Products</h1>
                <button className={mystyle.newTableBtn} onClick={() => setShowAddForm(true)}>+ Add New Item</button>
            </div>
            <hr />

            {showAddForm && (
                <div className={mystyle.formContainer}>
                    <form onSubmit={handleAddSubmit} className={mystyle.form}>
                        <h2>Add New Item</h2>
                        <label>Item Name:</label>
                        <input type="text" name="name" value={newItem.name} onChange={handleNewItemChange} required />
                        <label>Price (₹):</label>
                        <input type="number" name="price" value={newItem.price} onChange={handleNewItemChange} required />
                        <label>Image URL:</label>
                        <input type="text" name="imageUrl" value={newItem.imageUrl} onChange={handleNewItemChange} required />
                        <label>Ingredients (comma-separated):</label>
                        <input type="text" name="ingredients" value={newItem.ingredients} onChange={handleNewItemChange} required />
                        <div className={mystyle.formButtons}>
                            <button type="submit" className={mystyle.submitBtn}>Add Item</button>
                            <button type="button" className={mystyle.cancelBtn} onClick={() => setShowAddForm(false)}>Cancel</button>

                        </div>
                    </form>
                </div>
            )}

            {showEditForm && (
                <div className={mystyle.formContainer}>
                    <form onSubmit={handleEditSubmit} className={mystyle.form}>
                        <h2>Edit Item</h2>
                        <label>Item Name:</label>
                        <input type="text" name="name" value={editItem.name} onChange={handleEditItemChange} required />
                        <label>Price (₹):</label>
                        <input type="number" name="price" value={editItem.price} onChange={handleEditItemChange} required />
                        <label>Image URL:</label>
                        <input type="text" name="imageUrl" value={editItem.imageUrl} onChange={handleEditItemChange} required />
                        <label>Ingredients (comma-separated):</label>
                        <input type="text" name="ingredients" value={editItem.ingredients} onChange={handleEditItemChange} required />
                        <div className={mystyle.formButtons}>
                            <button type="submit" className={mystyle.submitBtn} >Update Item</button>
                            <button type="button" className={mystyle.cancelBtn} onClick={() => setShowEditForm(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className={mystyle.scrollableContainer}>
                <div className={mystyle.menuContainer}>
                    {menu.map((item) => (
                        <div key={item._id} className={mystyle.menuItem}>
                            <img src={item.imageUrl} alt="" />
                            <div className={mystyle.head}>
                                <h3>{item.name}</h3>
                                <h3 className={mystyle.price}>₹ {item.price}</h3>
                            </div>
                            <div className={mystyle.ingredients}>{item.ingredients.join(", ")}.</div>
                            <div className={mystyle.btnDiv}>
                                <button className={`${mystyle.addBtn} ${mystyle.edit}`} onClick={() => handleEdit(item)}>Edit</button>
                                <button className={`${mystyle.addBtn} ${mystyle.delete}`} onClick={() => handleDelete(item._id)}>Delete</button>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Products;