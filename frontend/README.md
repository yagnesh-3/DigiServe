# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
- fully implemet rbac
- orders page
- only the manager or admin can do edit or adding the products
- start kitchen portal
- Dashboard for waiter will display all the orders that were done by him
- Dashboard for manager/admin will display all the orders that were placed
- Dashboard for chef will display the orders that are pending in status
- add overlay to conform when changing the order status
- by clicking on place order on a overlay the items selected will be displayed and customers details will be collected
- after clicking conform order it display order sucessful with order id/ token number
- once the order is placed on a table no further order will be taken to the table except for payment and additional order
- add ring for chef when ever a new order is placed
- add table in sidebar for manager so he can see the satus of all the tables at once
- if no use of home remove home and the dashboard is the / route
- we need to look into takeaway orders
- what should be there in notifications
- profile updates and user managment for admin