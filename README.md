# 🛠️ Team Sync - Your Ultimate Collaboration Companion
 A sleek, fully responsive web application designed to streamline teamwork and project management. Team Sync ensures seamless communication, task tracking, and real-time updates — all in one place.


## 💡 Project Overview
 Team Sync is built to revolutionize team collaboration. With a user-friendly interface, intuitive navigation, and seamless cross-device compatibility, this platform allows you to keep your projects on track, manage tasks effortlessly, and ensure smooth communication within teams. Whether you're working from an office or remotely, Team Sync has your back!

## Features

- User Authentication: Secure user registration and login system.
- Project Management: Create, update, and delete projects.
- Task Management: Create, update, and delete tasks within each project.
- User Management: Invite team members to collaborate on projects.
- Real-time Updates: Utilizes WebSockets for real-time project and task updates.
- Dashboard: A user-friendly dashboard to manage your projects and tasks.
- Task Prioritization: Assign priorities to tasks to manage work efficiently.
- Responsive Design: The application is designed to work seamlessly on various devices.

## Installation

To run this project locally, follow these steps:

1. Clone the repository:
``` bash
git clone https://github.com/MentorTeamSync/teamsync_Infosys_Internship_Oct2024.git
```
## 
2. Install server dependencies:

``` bash
cd backend
npm install
```


## 3. Install client dependencies:

``` bash
cd ../client
npm install
```

## 
4. Start the server:


``` bash
cd ../backend
npm start
```

## 
5. Start the client:

``` bash
cd ../client
npm run start
```


6. Open your web browser and navigate to `http://localhost:3000` to access the Project Management MERN application.

## Configuration

- The server expects a `config.env` file in the `/backend/config/` directory. You should define the following variables:
- `MONGODB_URI`: MongoDB connection URI
- `JWT_SECRET`: Secret key for JSON Web Tokens
- `PORT`: Port number for the server (default is 3001)

## Contributing

We welcome contributions to enhance the functionality and usability of this project. If you want to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and test thoroughly.
4. Commit your changes with clear and concise messages.
5. Push your changes to your forked repository.
6. Create a pull request to the main repository.

Please ensure that your code follows the coding standards and includes relevant documentation.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


## Happy Project Management with Team Sync! 🚀🔧📊
