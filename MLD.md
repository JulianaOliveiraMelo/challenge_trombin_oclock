# MLD

## promo

- id : INT
- name : TEXT
- github_organization : TEXT/URL

## student

- id : INT
- first_name : TEXT
- last_name : TEXT
- github_username : TEXT
- promo_id : INT

## RELATIONNEL

"student > promo_id"

sera relier à 

"promo > id"