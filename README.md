# 🧑‍🍳 Veganise It! 🌱

[![Netlify Status](https://img.shields.io/netlify/1f72332d-e954-47c0-a4fd-6f8929ea668c?style=flat-square)](https://app.netlify.com/sites/veganise-it/deploys) [![Heroku Status](https://pyheroku-badge.herokuapp.com/?app=veganise-it-api&style=flat-square)](https://dashboard.heroku.com/apps/veganise-it-api/activity)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat-square&logo=react&logoColor=%2361DAFB) ![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=flat-square&logo=redux&logoColor=white) ![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=flat-square&logo=material-ui&logoColor=white) ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=react-router&logoColor=white) ![Netlify](https://img.shields.io/badge/netlify-%23000000.svg?style=flat-square&logo=netlify&logoColor=#00C7B7)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=flat-square&logo=mongodb&logoColor=white) ![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=flat-square&logo=heroku&logoColor=white) ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=flat-square&logo=amazon-aws&logoColor=white) ![Yarn](https://img.shields.io/badge/yarn-%232C8EBB.svg?style=flat-square&logo=yarn&logoColor=white)

### [Launch app ↗️](https://veganise.it)

Even though it's all one git repository, both the `api` and `app` folders are completely seperate projects as far as `yarn` is concerned.

#### To deploy front-end `app` updates to Netlify

Just push to `master` branch.

#### To deploy `api` updates to Heroku

Use

```
git subtree push --prefix api heroku master
```

because Heroku [does not officially support](https://github.com/heroku/heroku-buildpack-nodejs/issues/385) deploying from sub-directories.

## License

[![Copyright](https://img.shields.io/badge/copyright-benmneb-important?style=flat-square)](https://github.com/benmneb) [![Lisence](https://img.shields.io/badge/license-CC%20BY--NC%204.0-informational?style=flat-square)](http://creativecommons.org/licenses/by-nc/4.0/)

You are free to:

    Share — copy and redistribute the material in any medium or format

    Adapt — remix, transform, and build upon the material

Under the following terms:

    Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.

    NonCommercial — You may not use the material for commercial purposes.

    No additional restrictions — You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.

This is a human-readable summary of (and not a substitute for) the [license](https://creativecommons.org/licenses/by-nc/4.0/legalcode).
