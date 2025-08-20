import mysql.connector
from datetime import date

def placeOrder(user_id=int,menu_item_id=int,item_quantity=int):
    """place an order use this function. provide user id, item id(get it from menuDetails) and how many of that item"""
    connection = getConnection()
    if connection is None:
        print("Failed to connect to the database.")
        return "fail"

    cursor = None
    try:
        cursor = connection.cursor()
        
        # Correct parameterized query with proper placeholders
        query = """
        INSERT INTO cart_items (userId, menuId, qty) VALUES (%s, %s, %s)
        """
        # Execute with parameters
        cursor.execute(query, (user_id, menu_item_id, item_quantity))
        
        # Commit the transaction
        connection.commit()
        
        # Get the auto-generated reservation ID
        order_id = cursor.lastrowid
        return "tell user to go to the cart page and make payment to continue the order"

    except mysql.connector.Error as err:
        #print(f"Database Error: {err}")
        # Rollback in case of error
        if connection:
            connection.rollback()
        return f"order is already in the cart page"

    finally:
        # Close resources properly
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

def makeReservation(userId, date, time, num_people):
    """to make a reservation at the restaurant. provide use id, date(yyyy-mm-dd)(use getToday to retrieve today date and time), time(hh:mm) and number of people"""
    connection = getConnection()
    if connection is None:
        print("Failed to connect to the database.")
        return "fail"

    cursor = None
    try:
        cursor = connection.cursor()
        
        # Correct parameterized query with proper placeholders
        query = """
        INSERT INTO reservations 
            (userId, reservationDate, reservationTime, partySize) 
        VALUES 
            (%s, %s, %s, %s)
        """
        # Execute with parameters
        cursor.execute(query, (userId, date, time, num_people))
        
        # Commit the transaction
        connection.commit()
        
        # Get the auto-generated reservation ID
        reservation_id = cursor.lastrowid
        return "reservation success. reservation id is " + str(reservation_id)

    except mysql.connector.Error as err:
        print(f"Database Error: {err}")
        # Rollback in case of error
        if connection:
            connection.rollback()
        return f"Database Error: {err}"

    finally:
        # Close resources properly
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

def menuDetails():
    """Retrieve all menu items id,name,price category as a list of dictionaries"""
    connection = getConnection()
    if connection is None:
        print("Failed to connect to the database.")
        return "fail"

    cursor = None
    try:
        # Create dictionary cursor to get results as key-value pairs
        cursor = connection.cursor(dictionary=True)
        
        # Use parameterized query (safe and efficient)
        query = "SELECT id, itemName AS item, price, category FROM menu"
        cursor.execute(query)
        
        # Fetch ALL results
        data = cursor.fetchall()
        return data  # Return data to caller

    except mysql.connector.Error as err:
        print(f"Database Error: {err}")
        return []  # Return empty list on error

    finally:
        # Ensure resources are closed even if errors occur
        if cursor:
            cursor.close()
        if connection.is_connected():
            connection.close()

def orderStatus(user_id):
    """if user need to check their orders details"""
    connection = getConnection()
    if connection is not None:
        try:
            cursor = connection.cursor()

            query = """SELECT 
                            orders.id AS order_id,
                            orders.totalAmount AS total_cost,
                            orders.status AS status,
                            orders.paymentMethod AS payment_method,
                            menu.itemName AS item_name
                        FROM orders
                        JOIN order_items ON orders.id = order_items.orderId
                        JOIN menu ON order_items.menuId = menu.id
                        WHERE orders.userId = %s"""
            cursor.execute(query,(user_id,))
            
            # Fetch ALL results
            status = cursor.fetchall()
            
            if not status:
                return "no orders for this user"

            txt = ""

            for row in status:
                # Access elements of current row (not status[0])
                txt += f"order_id:{row[0]}, total_cost:{row[1]}, status:{row[2]}, payment_method:{row[3]}, item_name:{row[4]}\n"

            return txt

        except mysql.connector.Error as err:
            print(f"Query Error: {err}")
            raise
        
        finally:
            # Close the cursor and connection
            cursor.close()
            connection.close()
    else:
        print("Failed to connect to the database.")

def getToday():
    """to get today date and time"""   
    today = date.today()
    return today

def getConnection():
    """Establish a connection to the MySQL database."""
    try:
        connection = mysql.connector.connect(
            host="localhost",  # Replace with your MySQL server host
            user="root",  # Replace with your MySQL username
            password="giga",  # Replace with your MySQL password
            database="firebite",  # Replace with your database name
            port="3306"
        )
        connection.autocommit = True
 
        if connection.is_connected():
            return connection

    except mysql.connector.Error as err:
        raise

# can place order
# can make reservation
# can get menu detailes(item and price)
# can track the status of the order.(cooking, cooking finished)
