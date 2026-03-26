import React from 'react';
import { useLocation } from 'react-router-dom';

const CreateInvoice = () => {
    const { state } = useLocation();
    const { date, name, shopName, items } = state;

    return (
        <div>
            <h1>Invoice</h1>
            <p><strong>Date:</strong> {date}</p>
            <p><strong>Salesperson:</strong> {name}</p>
            <p><strong>Shop Name:</strong> {shopName}</p>
            <table>
                <thead>
                    <tr>
                        <th>Brand</th>
                        <th>Item Number</th>
                        <th>Carton Number</th>
                        <th>Total Item Value</th>
                        <th>Total Carton Value</th>
                        <th>Total Value</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index}>
                            <td>{item.brand}</td>
                            <td>{item.itemNumber}</td>
                            <td>{item.cartonNumber}</td>
                            <td>{item.totalItemValue}</td>
                            <td>{item.totalCtnsValue}</td>
                            <td>{item.totalValue}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CreateInvoice;