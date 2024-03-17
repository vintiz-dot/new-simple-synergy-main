require("dotenv").config();
const axios = require("axios");
const path = require("path");
const cors = require("cors");
const express = require("express");
const app = express();
const hbs = require("hbs");
const PORT = process.env.PORT || 3100;
const viewsPath = path.join(__dirname, "../templates/views");
const publicFolder = path.join(__dirname, "../public");
const partialsPath = path.join(__dirname, "../templates/partials");
const usersViews = path.join(__dirname, "../user/views");
const pupetteer = require("puppeteer");
const fetch = require("node-fetch");
app.use(express.json());
hbs.registerPartials(partialsPath);

app.use(cors({ origin: process.env.REMOTE_CLIENT_APP, credentials: true }));
app.set("view engine", "hbs");
app.set("views", [viewsPath, usersViews]);

app.use(express.static(publicFolder));

app.get("/calendar", (req, res) => {
  res.send("events");
});

const priceList = {
  ieltsGroup: "50,000",
  satGroup: "70,000",
  greGroup: "70,000",
};

const districts = {
  Abuja: 547,
  Abeokuta: 562,
  Ajah_Lekki: 591,
  lagosMainland: 561,
  portHarcourt: 552,
  lagosIsland: 574,
  Enugu: 854,
};

app.get("/ielts-ukvi-dates", async (req, res) => {
  try {
    const data = JSON.stringify({
      districtIds: req.body.id || Object.values(districts),
      dates: req.body.dates,
      ieltsModule: req.body.model,
      examOption: "IELTSUKVI",
      daysToNearestPbExam: 0,
      daysToNearestCdExam: 0,
    });

    const config = {
      method: "post",
      url: process.env.ukviUrl,
      headers: {
        "Content-Type": "application/json",
        Cookie: +process.env.ieltsCookie,
      },
      data,
    };

    const cbt = {};
    const abuja_cbt = {};
    const mainlandLagos_cbt = {};
    const islandLagos_cbt = {};
    const portHarcourt_cbt = {};
    const abuja_paper = {};
    const mainlandLagos_paper = {};
    const islandLagos_paper = {};
    const portHarcourt_paper = {};
    const paper = {};

    const dates = await axios(config);
    dates.data.computerDelivered.forEach((d) => {
      let holder = [];
      d.districts.forEach((dis) => {
        let state = {};
        state[dis.districtName] = dis.locations;
        holder.push(state);
      });
      cbt[d.date.split("T")[0]] = holder;
    });

    Object.keys(cbt).forEach((date) => {
      cbt[date].forEach((exam) => {
        if (Object.keys(exam).includes("Abuja")) abuja_cbt[date] = exam;
        if (Object.keys(exam).includes("Lagos Mainland"))
          mainlandLagos_cbt[date] = exam;
        if (Object.keys(exam).includes("Port Harcourt"))
          portHarcourt_cbt[date] = exam;
        if (Object.keys(exam).includes("Lagos Island"))
          islandLagos_cbt[date] = exam;
      });
    });

    dates.data.paperBased.forEach((d) => {
      let holder = [];
      d.districts.forEach((dis) => {
        let state = {};
        state[dis.districtName] = dis.locations;
        holder.push(state);
      });
      paper[d.date.split("T")[0]] = holder;
    });

    Object.keys(paper).forEach((date) => {
      paper[date].forEach((exam) => {
        if (Object.keys(exam).includes("Abuja")) abuja_paper[date] = exam;
        if (Object.keys(exam).includes("Lagos Mainland"))
          mainlandLagos_paper[date] = exam;
        if (Object.keys(exam).includes("Port Harcourt"))
          portHarcourt_paper[date] = exam;
        if (Object.keys(exam).includes("Lagos Island"))
          islandLagos_paper[date] = exam;
      });
    });

    res.send({
      mainlandLagos_cbt,
      islandLagos_cbt,
      abuja_cbt,
      portHarcourt_cbt,
      mainlandLagos_paper,
      islandLagos_paper,
      abuja_paper,
      portHarcourt_paper,
    });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.get("/ielts-dates", async (req, res) => {
  try {
    const data = JSON.stringify({
      ieltsModule: req.body.module || 1,
      pagination: {
        page: 1,
        pageSize: 20,
      },
      sorting: [
        {
          sortField: "examDate",
          sortDir: 1,
        },
        {
          sortField: "startTime",
          sortDir: 1,
        },
      ],
      daysToNearestCdExam: 0,
      daysToNearestPbExam: 0,
      districtIds: req.body.district || [547],
    });

    const config = {
      method: "post",
      url: process.env.ieltsUrl,
      headers: {
        "Content-Type": "application/json",
        Cookie: +process.env.ieltsCookie,
      },
      data,
    };

    const dates = await axios(config);
    res.send(dates.data);
  } catch (error) {
    res.status(404).send(error);
  }
});

app.get("/gre-dates", async (req, res) => {
  const greParams = {
    ExamId: process.env.ExamId,
    Latitude: process.env.Latitude,
    Longitude: process.env.Longitude,
    MaxCutOffDistance: process.env.MaxCutOffDistance,
    CountryCode: process.env.CountryCode,
    programCode: process.env.programCode,
  };
  const params = new URLSearchParams(greParams);
  const greURL = `${process.env.greURl}${params}`;
  try {
    const greDates = await fetch(greURL);
    const jsonRes = await greDates.json();
    const dates = [];
    jsonRes.data
      .filter((data) => {
        return data.schedulingSystemCode === "ST";
      })
      .forEach((data) => {
        data.seatAvailability.availability.forEach((dat) => {
          if (dates.includes(dat.adminDate)) return;
          {
            dates.push(dat.adminDate);
          }
        });
      });
    if (dates.length === 0) {
      throw new Error("No results found with search criteria, try again...");
    }
    res.send(dates);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.get("/", (_req, res) => {
  res.render("index", {
    name: "Synergy Lifeline Consulting",
    price: priceList,
  });
});

app.get("/about", (_req, res) => {
  res.render("about", { name: "Synergy Lifeline Consulting" });
});

app.get("/cgfns-classes", (_req, res) => {
  res.render("cgfns-classes", { name: "Synergy Lifeline Consulting" });
});

app.get("/contact", (_req, res) => {
  res.render("contact", { name: "Synergy Lifeline Consulting" });
});

app.get("/course-details", (_req, res) => {
  res.render("course-details", { name: "Synergy Lifeline Consulting" });
});

app.get("/courses", (_req, res) => {
  res.render("courses", { name: "Synergy Lifeline Consulting" });
});

app.get("/events", (_req, res) => {
  res.render("events", { name: "Synergy Lifeline Consulting" });
});

app.get("/gmat-classes", (_req, res) => {
  res.render("gmat-classes", { name: "Synergy Lifeline Consulting" });
});

app.get("/gmat-faqs", (_req, res) => {
  res.render("gmat-faqs", { name: "Synergy Lifeline Consulting" });
});

app.get("/gre-classes", (_req, res) => {
  res.render("gre-classes", {
    name: "Synergy Lifeline Consulting",
    price: priceList.greGroup,
  });
});

app.get("/gre-faqs", (_req, res) => {
  res.render("gre-faqs", { name: "Synergy Lifeline Consulting" });
});

app.get("/ielts-classes", (_req, res) => {
  res.render("ielts-classes", {
    name: "Synergy Lifeline Consulting",
    price: priceList.ieltsGroup,
  });
});

app.get("/ielts-faqs", (_req, res) => {
  res.render("ielts-faqs", { name: "Synergy Lifeline Consulting" });
});

app.get("/pricing", (_req, res) => {
  res.render("pricing", { name: "Synergy Lifeline Consulting" });
});

app.get("/privacy", (_req, res) => {
  res.render("privacy", { name: "Synergy Lifeline Consulting" });
});

app.get("/pte-classes", (_req, res) => {
  res.render("pte-classes", { name: "Synergy Lifeline Consulting" });
});

app.get("/pte-faqs", (_req, res) => {
  res.render("pte-faqs", { name: "Synergy Lifeline Consulting" });
});

app.get("/sat-classes", (_req, res) => {
  res.render("sat-classes", { name: "Synergy Lifeline Consulting" });
});

app.get("/sat-faqs", (_req, res) => {
  res.render("sat-faqs", { name: "Synergy Lifeline Consulting" });
});

app.get("/terms-of-service", (_req, res) => {
  res.render("terms of service", { name: "Synergy Lifeline Consulting" });
});

app.get("/toefl-classes", (_req, res) => {
  res.render("toefl-classes", { name: "Synergy Lifeline Consulting" });
});

app.get("/toefl-faqs", (_req, res) => {
  res.render("toefl-faqs", { name: "Synergy Lifeline Consulting" });
});

app.get("/trainers", (_req, res) => {
  res.render("trainers", { name: "Synergy Lifeline Consulting" });
});

app.get("/sat-diagnostics", (req, res) => {
  res.render("SAT-Diagnotics", {
    name: "Synergy Lifeline Consulting",
    test: " Diagnostics",
  });
});

app.get("*", (_req, res) => {
  res.render("404", { name: "Synergy Lifeline Consulting" });
});

app.listen(PORT, () => console.log("started sever sucesfullly on ", PORT));
