import './Selection.scss';
import '../arma.scss';
import {useEffect, useState} from "react";

const INITIAL_FILTER = {
	tag: "",
	newer: "2017-06-01",
	older: "2099-01-01"
};

function Selection({onSelect}) {
	const [replays, setReplays] = useState([]);
	const [filter, setFilter] = useState(INITIAL_FILTER);

	useEffect(() => {
		fetch("/api/v1/operations?" + new URLSearchParams(filter))
			.then(r => r.json())
			.then(r => setReplays(r));
	}, [filter]);

	function formatDuration(sec_num) {
		const hours = Math.floor(sec_num / 3600);
		const minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		const seconds = sec_num - (hours * 3600) - (minutes * 60);
		return `${(hours < 10 ? "0" : "") + hours}h ${(minutes < 10 ? "0" : "") + minutes}m ${(seconds < 10 ? "0" : "") + seconds}s`;
	}

	function renderTable() {
		return replays.map((replay) => {
			return (
				<tr key={replay.id} onClick={() => onSelect(replay)}>
					<td>{replay.mission_name}</td>
					<td>{replay.world_name}</td>
					<td>{new Date(replay.date).toLocaleDateString()}</td>
					<td>{formatDuration(replay.mission_duration)}</td>
					<td>{replay.tag}</td>
				</tr>
			)
		})
	}

	function changeFilter(key, value) {
		// console.log(e);
		const newFilter = {...filter};
		newFilter[key] = value;
		setFilter(newFilter);
	}

	return (
		<div className="selectionModal">
			<div className="selectionDialog">
				<div className="selectionHeader">Select mission</div>
				<div className="selectionFilter">
					<div className="a3-theme select tag">
						<select onChange={(e) => changeFilter("tag", e.target.value)}>
							<option value="">All</option>
							<option value="TC">TC</option>
							<option value="TvT">TvT</option>
						</select>
					</div>
					<input type="text" className="a3-theme input missionName" placeholder="Mission name" onChange={(e) => changeFilter("name", e.target.value)}/>
					<input type="date" className="a3-theme input" defaultValue={filter.newer} onChange={(e) => changeFilter("newer", e.target.value)}/>
					<input type="date" className="a3-theme input" defaultValue={filter.older} onChange={(e) => changeFilter("older", e.target.value)}/>
				</div>
				<div className="selectionBody">
					<table>
						<thead>
							<tr>
								<th>Mission</th>
								<th>Map</th>
								<th>Date</th>
								<th>Duration</th>
								<th>Tag</th>
							</tr>
						</thead>
						<tbody>
						{renderTable()}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default Selection;
