import Language from '@material-ui/icons/Language'
import React from 'react'
import Card from '../../components/Card/Card'
import CardBody from '../../components/Card/CardBody'
import CardHeader from '../../components/Card/CardHeader'
import CardIcon from '../../components/Card/CardIcon'
import GridContainer from '../../components/Grid/GridContainer'
import GridItem from '../../components/Grid/GridItem'
import Table from '../../components/Table/Table'

const TopGamesTableComponent = (props) => {
    const tableHead = [
        'Место',
        'Никнейм',
        'Кол-во игр'
    ]
    const tableData = []

    props.topGamesTable.forEach((player, index) => {
        tableData.push([
            `#${index + 1}`,
            player.playerNickname,
            player.gamesTotal
        ])
    })

    return (
        <Card>
            <CardHeader color="success" icon>
                <CardIcon color="success">
                    <Language />
                </CardIcon>
                <h4 className={props.classes.cardIconTitle}>
                    Топ по количеству игр
                </h4>
            </CardHeader>
            <CardBody>
                <GridContainer justify="space-between">
                    <GridItem xs={12} sm={12} md={12}>
                        <Table
                            tableHead={tableHead}
                            tableData={tableData}
                        />
                    </GridItem>
                </GridContainer>
            </CardBody>
        </Card>
    )
}

export default TopGamesTableComponent
