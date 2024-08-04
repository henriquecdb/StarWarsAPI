/* eslint-disable no-unused-vars */
import axios from "axios";
import fs from "fs";
import { marked } from "marked";
import process from "process";

const engine = (template, ...data) => {
    return template.map((s, i) => s + `${data[i] || ""}`).join("");
};

const render = (result) => {
    const title = "Star Wars API";
    const count = result.data.count;
    const items = result.data.results;
    const markdown = engine`
    # ${title}
    Tem ${count} pessoas

    | Name | Height | Mass | Hair Color | Skin Color | Eye Color | Birth Year | Gender |
    |------|--------|------|------------|------------|-----------|------------|--------|
    ${items
        .map((item) => {
            return [
                item.name,
                item.height,
                item.mass,
                item.hair_color,
                item.skin_color,
                item.eye_color,
                item.birth_year,
                item.gender,
                "",
            ].join(" | ");
        })
        .join("\n")}
    `;
    console.log(marked(markdown));
    return marked(markdown);
};
axios
    .get("https://swapi.dev/api/people")
    .then(render)
    .then((_) => process.exit());

async function* paginate() {
    let page = 1;
    let result;
    while (!result || result.status === 200) {
        try {
            result = axios.get(`https://swapi.dev/api/people?page=${page}`);
            yield result;
        } catch (e) {
            return e;
        }
    }
}

const getData = async () => {
    let results = [];
    for await (const response of paginate()) {
        results = results.concat(response.data.results);
    }
    return {
        count: results.length,
        results,
    };
};

getData()
    .then(render)
    .then((result) => fs.writeFile("people.html", result))
    .then((_) => process.exit());
