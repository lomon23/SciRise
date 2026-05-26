# SciRise 🎓🚀

SciRise is a comprehensive educational platform that combines tools for learning and real-time communication. The project is designed to integrate communication capabilities with an environment for taking courses and studying.

## 🏗 Project Structure

* backend/ 
* frontend_web/ 
* frontend_desktop/ 

## 🛠 Tech Stack

* Backend: Python, Django 
* Frontend: React 
* Desktop / Additional modules: C++, Qt

---

## ⚙️ Setup Instructions

### 1. Running the Backend 

Navigate to the backend directory, create a virtual environment, install dependencies, apply database migrations, and start the server:
```
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```
### 2. Running Frontend Web 

Navigate to the web client directory, install npm packages, and start the development server:
```
cd frontend_web
npm install
npm run dev
```
### 3. Building and Running Frontend Desktop 

To compile the C++ and Qt-based desktop application, execute the following commands:
```
cd frontend_desktop
mkdir build
cd build
cmake ..
make
```