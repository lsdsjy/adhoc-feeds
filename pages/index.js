export async function getStaticProps() {
  const fs = require('fs/promises')
  const path = require('path')
  return { props: { files: await fs.readdir('pages/api')}}
}

export default function Home(props) {
  return (
      <ul>
        {props.files.map((filename) => {
          const name = filename.split('.')[0]
        return <li key={name}><a href={`/api/${name}`}>{name}</a></li>
})}
      </ul>
  )
}
