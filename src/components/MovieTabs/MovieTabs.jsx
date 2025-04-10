import { Tabs } from 'antd'
import SearchArea from '../SearchArea/SearchArea'
import CardList from '../CardList/CardList'
import RatedMovie from '../RatedMovie/RatedMovie'

const items = [
  {
    key: '1',
    label: 'Search',
    children: (
      <>
        <SearchArea />
        <CardList />
      </>
    ),
  },
  {
    key: '2',
    label: 'Rated',
    children: <RatedMovie />,
  },
]

export default function MovieTabs() {
  return <Tabs defaultActiveKey="1" items={items} centered tabBarStyle={{ marginInline: 'auto' }} />
}
