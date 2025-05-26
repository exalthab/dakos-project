Tools & Technologies Used for Dakos Website (Dakar Online Shop "Dakos")

This project showcases a dynamic product-based website called Dakos, built using modern web technologies. Below is a comprehensive list of tools, libraries, and files used throughout the development.

1. Frontend : Tools & Libraries
Tool/Library	         Purpose
|- HTML5	             =Structure and markup of web pages
|- CSS3	                 =Styling of the pages
|- Bootstrap 5.3	     =Responsive layout, UI components
|- Font Awesome 6.5	    =Icons for shopping cart & UI visuals
|- Google Fonts (Inter)	=Typography customization
|-Favicon (.png)	    =Tab branding (designed in Canva or similar tools)

2. JavaScript & Functionality

Module/Feature             Purpose
|
| `utils.js`            = -Currency formatting (XOF), cart operations (add, remove, save to localStorage)
| `product.js`          = Dynamically renders product cards from data                                   |
| `cart.js`             = Manages cart display, quantity updates, and item removal               |
| `filter.js`(planned)  = (To be added) Category-based product filtering for improved UX                                      |
| `script.js`           = Shared/global JavaScript functionality                                           |
| localStorage API  = PBrowser storage for persisting cart state
| **Intl.NumberFormat** = XOF currency formatting (fr-FR locale is FCFA), defaults you may use $.
| JavaScript ES Modules	 = Enables modular code with import/export syntax

3. Assets and Design

Assets              Description
--------------------------------------------- |
| `img/dakos.svg`   = Company logo (custom design or vector from design tools)
| `img/favicon.png` = Favicon for browser tab icon
| Product images    = Thumbnails for product cards (e.g., laptops, accessories)
| `css/style.css`   = Custom stylesheet to override or extend Bootstrap styles

4. Development tools

Tool/Utility                      Purpose
-------------------------------------------------
|Visual Studio Code (VS Code)|= Code editor
|Go Live Server Extension    |= Real-time browser reloads for development preview
| Git (optional)             |= Version control and collaboration
| `tree' command             |= CLI tool to display project folder structure (for documentation)


5. Final Project Structure = Dakos Website

Root Directory : DAKOS-WEBSITE

DAKOS-WEBSITE APP
|--- about.html
|--- cart.html
|--- checkout.html
|--- contact.html
|--- README.md
|--- index.html
|--- product.html
|--- thank-you.html
|   
|       
+---css/
|       about.css
|       all.min.css
|       bootstrap.min.css
|       cart.css
|       checkout.css
|       contact.css
|       product.css
|       style.css
|       thank-you.css
|       
+---data
|       product.json
|       
+---img
|       dakos.svg
|       favicon.png
|       keyboard.jpg
|       laptop.jpg
|       mouse.jpg
|       team1.jpg
|       team2.jpg
|       team3.jpg
|       
\---js
    |-- bootstrap.bundle.js
    |-- cart.js
    |-- checkout.js
    |-- product.js
    |-- script.js
    |-- utils.js
        
Note:
---------------------------------------------------
Dakar Online Shop "Dakos", is a fictional final project-study created to demonstrate a responsive e-commerce-like static website using modern frontend development techniques.

The main purpose was to Build the HTML structure, apply CSS styling, and implement JavaScript functionality to allow users to browse the application.