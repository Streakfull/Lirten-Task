const tableCreation = `
CREATE TABLE app_user (
  id INT GENERATED BY DEFAULT AS IDENTITY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_suspended BOOLEAN DEFAULT FALSE,
  frozen BOOLEAN DEFAULT false,
  PRIMARY KEY (id),
  UNIQUE(email)
);

CREATE TABLE task (
 id INT GENERATED BY DEFAULT AS IDENTITY,
 name VARCHAR(50) NOT NULL,
  end_date TIMESTAMP,
  edit_frozen BOOLEAN,
  user_id INT,
  frozen BOOLEAN DEFAULT false,
  PRIMARY KEY(id),
  FOREIGN KEY(user_id) REFERENCES app_user(id)	
);


CREATE TABLE application(
 user_id INT,
 task_id INT,
 accepted BOOLEAN DEFAULT false,
 frozen BOOLEAN DEFAULT false,
 PRIMARY KEY (user_id,task_id),
 FOREIGN KEY (user_id) REFERENCES app_user (id),
 FOREIGN KEY (task_id) REFERENCES task(id)
);


CREATE TABLE submission(
 user_id INT,
 task_id INT,
 text VARCHAR(255),
 is_confirmd BOOLEAN,
 frozen BOOLEAN DEFAULT false,
 FOREIGN KEY (user_id) REFERENCES app_user(id),
 FOREIGN KEY (task_id) REFERENCES task(id)
);

CREATE TABLE meeting(
 id INT GENERATED BY DEFAULT AS IDENTITY,
 organiser_id INT,
 is_confirmed BOOLEAN,
 frozen BOOLEAN DEFAULT false,
 PRIMARY KEY(id),
 FOREIGN KEY(organiser_id) REFERENCES app_user(id)
);

CREATE TABLE meeting_task(
 meeting_id INT,
 task_id INT,
 frozen BOOLEAN DEFAULT false,
 PRIMARY KEY(meeting_id,task_id),
 FOREIGN KEY(meeting_id) REFERENCES meeting(id),
 FOREIGN KEY(task_id) REFERENCES task(id)
);

CREATE TABLE meeting_attendance (
 meeting_id INT,
 user_id INT,
 frozen BOOLEAN DEFAULT false,
 PRIMARY KEY(meeting_id,user_id),
 FOREIGN KEY(meeting_id) REFERENCES meeting(id),
 FOREIGN KEY(user_id) REFERENCES app_user(id)
);
`
// Index on user.email goes here
module.exports = tableCreation
