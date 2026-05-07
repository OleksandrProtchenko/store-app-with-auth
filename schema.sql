CREATE TABLE users (
    id         VARCHAR(24)  PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    refreshToken TEXT        DEFAULT NULL,
    createdAt  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id          VARCHAR(24)  PRIMARY KEY,
    userId      VARCHAR(24)  NOT NULL,
    title       VARCHAR(255) NOT NULL,
    description TEXT         NOT NULL,
    createdAt   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE products (
    id            VARCHAR(24)  PRIMARY KEY,
    orderId       VARCHAR(24)  NOT NULL,
    serialNumber  INT          NOT NULL,
    title         VARCHAR(255) NOT NULL,
    type          VARCHAR(100) NOT NULL,
    isNew         TINYINT(1)   DEFAULT NULL,
    photo         VARCHAR(500) DEFAULT NULL,
    specification TEXT         DEFAULT NULL,
    guaranteeStart VARCHAR(50) NOT NULL,
    guaranteeEnd   VARCHAR(50) NOT NULL,
    `order`       INT          DEFAULT NULL,
    createdAt     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE product_prices (
    id        INT          PRIMARY KEY AUTO_INCREMENT,
    productId VARCHAR(24)  NOT NULL,
    value     DECIMAL(10,2) NOT NULL,
    symbol    VARCHAR(10)  NOT NULL,
    isDefault TINYINT(1)   NOT NULL DEFAULT 0,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);