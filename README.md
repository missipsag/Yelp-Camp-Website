# Yelp Camp Website

Yelp Camp is a web application where users can create and review campgrounds. This project is part of The Web Developer Bootcamp course.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features
- User authentication with Passport.js
- Authorization for campground ownership
- CRUD operations for campgrounds and reviews
- Responsive design with Bootstrap
- Map integration with Mapbox
- Image upload with Cloudinary

## Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js
- EJS
- Bootstrap
- Mapbox
- Cloudinary

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/yelp-camp.git
    ```
2. Navigate to the project directory:
    ```bash
    cd yelp-camp
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Set up environment variables:
    - Create a `.env` file in the root directory.
    - Add the following variables:
        ```
        DATABASE_URL=<your-mongodb-url>
        CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
        CLOUDINARY_KEY=<your-cloudinary-key>
        CLOUDINARY_SECRET=<your-cloudinary-secret>
        MAPBOX_TOKEN=<your-mapbox-token>
        ```

## Usage
1. Start the server:
    ```bash
    npm start
    ```
2. Open your browser and navigate to `http://localhost:3000`.

## Project Structure
```
yelp-camp/
├── models/
│   ├── campground.js
│   ├── review.js
│   └── user.js
├── public/
│   ├── stylesheets/
│   └── javascripts/
├── routes/
│   ├── campgrounds.js
│   ├── reviews.js
│   └── users.js
├── views/
│   ├── campgrounds/
│   ├── reviews/
│   ├── partials/
│   └── users/
├── .env
├── app.js
├── package.json
└── README.md
```

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
- GitHub: missipsag (https://github.com/missipsag)
- Email: ghernaoutmissipsa.pro@gmail.com
